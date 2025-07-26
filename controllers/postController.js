const {PrismaClient}=require('@prisma/client');
const prisma=new PrismaClient();
const getPostsQuery = require('../utils/getPosts');
const { response } = require('express');

//to write 1000 views as 1k
function formatViewCount(count) {
    if (count < 1000) return count.toString();
    if (count < 1_000_000) {
      return (count / 1000).toFixed(count % 1000 === 0 ? 0 : 1) + 'k';
    }
    return (count / 1_000_000).toFixed(count % 1_000_000 === 0 ? 0 : 1) + 'M';
}  

exports.getFollowingFeed=async(req,res)=>{
    const userId = req.session.userId;
    const page = parseInt(req.query.page) || 1;
    let ITEMS_PER_PAGE=5;
    const skip = (page - 1) * ITEMS_PER_PAGE;
        
    // Step 1: Get followed user IDs
    const followedUsers = await prisma.userFollow.findMany({
        where: { followerId: userId },
        select: { followingId: true }
    });
    const followedUserIds = followedUsers.map(followedUser => followedUser.followingId);

    // Step 2: Get followed topic IDs
    const followedTopics = await prisma.topicFollow.findMany({
        where: { userId },
        include:{
            topic:{
                select:{
                    name:true,
                    slug:true,
                }
            }
        }
    });
    const followedTopicIds = followedTopics.map(followedTopic => followedTopic.topicId);

    // Step 3: Get followed category IDs
    const followedCategories = await prisma.categoryFollow.findMany({
        where: { userId },
        include:{
            category:{
                select:{
                    name:true,
                    slug:true,
                }
            }
        }
    });
    const followedCategoryIds = followedCategories.map(followedCategory => followedCategory.categoryId);


    // Step 4: Fetch posts that match any of those
    //getPostsQuery method takes skip,Items_per_page and where{} as params and returns post array
    const posts = await getPostsQuery({
        skip,
        ITEMS_PER_PAGE,
        where: {
        OR: [
            { authorId: { in: followedUserIds } },
            { topicId: { in: followedTopicIds } },
            { categoryId: { in: followedCategoryIds } }
        ]
        },
    });
 
    const totalItems=await prisma.post.count({
        where: {
            OR: [
                { authorId: { in: followedUserIds } },
                { topicId: { in: followedTopicIds } },
                { categoryId: { in: followedCategoryIds } }
            ]
        },
    });
    
    const totalPages=Math.ceil(totalItems/ITEMS_PER_PAGE);

    res.render('posts/followingFeed', {
        posts,
        currentPage:page,
        totalPages,
        hasNextPage:page<totalPages,
        hasPreviousPage:page>1,
        nextPage:page+1,
        previousPage:page-1,
        getReadTime: res.locals.getReadTime,
        currentUser: res.locals.currentUser,
        followedTopics, //for scroll bar
        followedCategories, //for scroll bar
        feedTitle:"Your following feed",
        feedDescription:"Read articles from authors and topics that you follow...",
        activeTab: "following" // ✅ This activates the button
    });
}


exports.bookMarkPost=async(req,res)=>{
    const postId = parseInt(req.params.id);
    const currentUserId = req.session.userId; // Ensure currentUserId is correctly set in your session
    const redirectTo = req.header('Referer') || `/posts`; // Fallback to the all posts page

    try {
        const existingBookmark = await prisma.bookMark.findUnique({
            where: {
                userId_postId: {
                    userId: currentUserId,
                    postId: postId,
                },
            },
        });

        if (existingBookmark) {
            // If exists, delete (unbookmark)
            await prisma.bookMark.delete({
                where: {
                    userId_postId: {
                        userId: currentUserId,
                        postId: postId,
                    },
                },
            });
            res.redirect(redirectTo);
        } else {
            // If not exists, create (bookmark)
            await prisma.bookMark.create({
                data: {
                    userId: currentUserId,
                    postId: postId,
                },
            });
            res.redirect(redirectTo);
        }
    } catch (error) {
        console.error('Error toggling bookmark:', error);
    }
}

exports.showPostDetails=async(req,res)=>{
    const categories=res.locals.categories; //get categories from session
    const currentUser=res.locals.currentUser;
    const postId=parseInt(req.params.id);
    
    const post=await prisma.post.findUnique({
        where:{id:postId},
        include:{
            likes:{
                select:{
                    authorId:true
                }
            },// includes list of users who liked this post
            author:{
                include:{
                    followers:{
                        select:{
                            followerId:true,
                        }
                    }
                }
            },
            comments: {
                where:{parentId:null},
                include: {
                  children:{ //children= child comment(reply)
                    include:{
                        author:{
                            select:{
                                profilePictureUrl:true,
                                name:true
                            }
                        },
                        commentLikes:{
                            select:{
                                authorId:true
                            }
                        },
                    }
                  },
                  commentLikes:{
                    select:{
                        authorId:true
                    }
                  },
                  author: {
                    select:{
                        name:true,
                        profilePictureUrl:true,
                    }
                  }
                },
                orderBy: {
                  createdAt: 'asc'
                }
            },
            category:{
                select:{
                    name:true,
                }
            },
            bookmarks:{
                select:{
                    userId:true,
                    postId:true
                }
            },
            _count:{
                select:{
                    likes:true,
                    comments:true
                }
            }
        }
        });

    const recentPosts = await prisma.post.findMany({
            orderBy: {
              createdAt: 'desc' // sort by newest first
            },
            take: 5 // limit to 5 posts
    });
    //everytime user reads post,increase view count
    await prisma.post.update({
        where: { id: postId },
        data: {
          viewCount: {
            increment: 1 // 👈 +1 each time post is viewed
          }
        }
    });
    const mostReadPosts = await prisma.post.findMany({
        orderBy: {
          viewCount: 'desc' //large to small
        },
        take: 5,
        include:{
            author:{
                select:{
                    name:true,
                }
            }
        }
    });
    //console.log('post details',post);
    res.render('posts/postDetails',
        {post,currentUser,recentPosts,mostReadPosts,
            formatViewCount,
            categories,
            getReadTime:res.locals.getReadTime
        });
}

// Like/Unlike routes
exports.likePost=async(req,res)=>{
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        postId: parseInt(req.params.id),
        authorId: req.session.userId,
      },
    });

    //if like exists, the code assumes that user unlike the post
    if (existingLike) {
      // Unlike the post
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      return res.json({ liked: false });
    } else {
      // Like the post
      await prisma.like.create({
        data: {
          postId: parseInt(req.params.id),
          authorId: req.session.userId,
        },
      });
      return res.json({ liked: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error processing like' });
  }
}


//getPostsQuery(...)=used for searchPosts,listAllPosts,listMyPosts
exports.searchPosts=async(req,res)=>{
    const page = parseInt(req.query.page) || 1;
    let ITEMS_PER_PAGE=5;
    const skip = (page - 1) * ITEMS_PER_PAGE;

    const searchWord=req.query.search;
    let posts=[];
    if (searchWord.trim() !== "") {
        //getPostsQuery method takes skip,take and where{} as params and returns post array
        posts=await getPostsQuery({ skip, take:ITEMS_PER_PAGE,  
            where: {
                OR: [
                    { title: { contains: searchWord, mode: 'insensitive' } },
                    { content: { contains: searchWord, mode: 'insensitive' } }
                  ]
                } 
        });
    }
    const totalItems=await prisma.post.count({
        where:{
            OR: [
                { title: { contains: searchWord, mode: 'insensitive' } },
                { content: { contains: searchWord, mode: 'insensitive' } }
              ]
        }
    });
    const totalPages=Math.ceil(totalItems/ITEMS_PER_PAGE);

    res.render('posts/allPosts', { 
        posts,
        currentPage:page,
        totalPages,
        hasNextPage:page<totalPages,
        hasPreviousPage:page>1,
        nextPage:page+1,
        previousPage:page-1,
        getReadTime:res.locals.getReadTime
    });
}
  // Show all posts including current user and others
exports.listAllPosts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    let ITEMS_PER_PAGE=5;
    const skip = (page - 1) * ITEMS_PER_PAGE;
    //getPostsQuery method takes skip,take and where{} as params and returns post array
    const posts = await getPostsQuery(
        { skip, ITEMS_PER_PAGE }); //return posts from prisma Post model


    // Fetch followed topics by current user
    //note that topics are fetched from join table
    const followedTopics = await prisma.topicFollow.findMany({
        where: {
            userId: req.session.userId, //userId means followerId
        },
        include: {
            topic: {
                select:{
                    name:true, //to get topic name on horizontal scrollable bar
                    slug:true,
                }
            } 
        }
    });

    // Fetch followed categories by current user
    const followedCategories = await prisma.categoryFollow.findMany({
        where: {
            userId: req.session.userId, //userId means followerId
        },
        include: {
            category: {
                select:{
                    name:true, //to get category name on horizontal scrollable bar
                    slug:true,
                }
            }
        }
    });
    //console.log(`followed topics by ${res.locals.currentUser.name} is:`,followedTopics);
    //console.log(`followed categories by ${res.locals.currentUser.name} is:`,followedCategories);

    const totalItems=await prisma.post.count();
    
    const totalPages=Math.ceil(totalItems/ITEMS_PER_PAGE);

    const postsWithLikeInfo = posts.map(post => ({
        ...post,
        likedByUser: res.locals.currentUser
            ? post.likes.some(like => like.authorId === req.session.userId)
            : false,
    }));
    res.render('posts/allPosts', 
        {
            posts:postsWithLikeInfo,
            currentPage:page,
            totalPages,
            hasNextPage:page<totalPages,
            hasPreviousPage:page>1,
            nextPage:page+1,
            previousPage:page-1,
            getReadTime:res.locals.getReadTime,
            followedTopics,
            followedCategories,
            currentUser:res.locals.currentUser,
            feedTitle:"All Blog Posts",
            feedDescription:"Explore articles based on your interests...",
            activeTab:'all posts'
    });
};
  

//sql query (select * from posts where authorId=req.session.userId)
exports.listMyPosts=async (req,res)=>{
    const page = parseInt(req.query.page) || 1;
    let ITEMS_PER_PAGE=5;
    const skip = (page - 1) * ITEMS_PER_PAGE;
    //getPostsQuery method takes skip,take and where{} as params and returns post array
    const posts = await getPostsQuery({ skip, ITEMS_PER_PAGE,
        where:{
            authorId:req.session.userId
        }
     });

     const totalItems=await prisma.post.count({
        where:{
            authorId:req.session.userId
        }
    });
    const totalPages=Math.ceil(totalItems/ITEMS_PER_PAGE);

    res.render('posts/allPosts', { 
        posts,
        currentPage:page,
        totalPages,
        hasNextPage:page<totalPages,
        hasPreviousPage:page>1,
        nextPage:page+1,
        previousPage:page-1,
        currentUser:res.locals.currentUser,
        getReadTime:res.locals.getReadTime });   
};

exports.showCreateForm=async(req,res)=>{
    const categories=await prisma.category.findMany();
    res.render('posts/create',{categories});
}

exports.createPost=async (req,res)=>{
    const {title,subtitle,imageUrl,content,categoryId}=req.body;
    await prisma.post.create({
        data:{
            title,
            subtitle,
            imageUrl,
            content,
            authorId:req.session.userId,
            categoryId:parseInt(categoryId)
        }
    });
    res.redirect('/posts');
}

exports.showEditForm=async(req,res)=>{
    const post=await prisma.post.findUnique({
        where:{id:parseInt(req.params.id)}
    });
    const categories=await prisma.category.findMany({
    });
    //check post owner
    if(post.authorId !== req.session.userId ){
        return res.status(403).json({message:"This is not your post"});
    }
    
    res.render('posts/edit',{post,categories});
}

exports.updatePost=async(req,res)=>{
    const {title,content}=req.body;
    await prisma.post.update({
        where:{id:parseInt(req.params.id)}, //condition
        data:{title,content} //form data
    });
    res.redirect('/posts');
}

exports.deletePost=async(req,res)=>{
    const post=await prisma.post.findUnique({
        where:{id:parseInt(req.params.id)}
    });
    if(post.authorId !== req.session.userId){
        return res.status(403).send("Forbidden");
    }
    await prisma.post.delete({
        where:{id:parseInt(req.params.id)}
    });
    res.redirect('/posts');
}

