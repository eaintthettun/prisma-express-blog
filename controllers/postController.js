const {PrismaClient}=require('@prisma/client');
const prisma=new PrismaClient();
const getPostsQuery = require('../utils/getPosts');
const { response } = require('express');

exports.showPostDetails=async(req,res)=>{
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
    //console.log('post details',post);
    res.render('posts/postDetails',{post,currentUser});
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

// Route to store like in session (not DB yet)
//for one user
exports.likeTemp = (req, res) => {
    console.log('req body:',req.body);
    const { postId } = req.body;
    // to prevent liking the post again if already liked it.
    if (req.session.likedPosts.includes(postId)) {
      return res.json({ success: false, message: 'Already liked this post' });
    }
  
    req.session.likedPosts.push(postId);
    console.log('after push,req session post ids:',req.session.likedPosts);
    return res.json({ success: true });
  };
  

//toggle like method
//when user has 10 likes,then save them in DB
exports.saveLikes=async(req,res)=>{
  console.log('Saving likes triggered!');
  const userId = req.session.userId;
  const likedPosts = req.session.likedPosts || [];

    //   const existingLike = await prisma.like.findMany({
    //     where: {
    //       authorId_postId: {
    //         authorId,
    //         postId: parseInt(postId),
    //       },
    //     },
    //   });
    const response=await prisma.like.createMany({
            data: likedPosts.map(postId => ({
              authorId: userId,
              postId: parseInt(postId)
            })),
            skipDuplicates: true // built-in protection!
    });          
    console.log('response data:',response.data);
    req.session.likedPosts = []; // clear session likes
    res.json({ success: true });         
}

exports.unlikePost=async(req,res)=>{
    const userId=req.session.userId;
    const postId=parseInt(req.params.id);
    console.log('this is unlike post,post id',postId);
    let likedPosts=req.session.likedPosts;
 
    //remove from session
    likedPosts=likedPosts.filter(postId=>postId!==postId);
    console.log('after unliking,session likedPost:',likedPosts);
    const response=await prisma.like.delete({
        where:{
            authorId_postId:{
                authorId:userId,
                postId:postId
            }
        }
    });
    console.log('response unlike data:',response.data);
    res.json({success:true});
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
    });
}
  // Show all posts including current user and others
exports.listAllPosts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    let ITEMS_PER_PAGE=5;
    const skip = (page - 1) * ITEMS_PER_PAGE;
    //getPostsQuery method takes skip,take and where{} as params and returns post array
    const posts = await getPostsQuery(
        { skip, ITEMS_PER_PAGE }); //return posts from prisma

    const totalItems=await prisma.post.count();
    
    const totalPages=Math.ceil(totalItems/ITEMS_PER_PAGE);

    res.render('posts/allPosts', { posts,
        currentPage:page,
        totalPages,
        hasNextPage:page<totalPages,
        hasPreviousPage:page>1,
        nextPage:page+1,
        previousPage:page-1,
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
        currentUser:res.locals.currentUser });   
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

