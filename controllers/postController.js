const {PrismaClient}=require('@prisma/client');
const prisma=new PrismaClient();
const getPostsQuery = require('../utils/getPosts');

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

//toggle like method
exports.likePost=async(req,res)=>{
    const authorId = req.session.userId; //who like the post
    const postId = parseInt(req.params.id);  //which post he likes
    const redirectTo = req.header('Referer') || `/posts#like`; // Fallback to the all posts page
    // Check if like already exists
    const existingLike = await prisma.like.findUnique({
        where: {
          authorId_postId: {
            authorId,
            postId,
          },
        },
    });
    if(existingLike){
        // User already liked → unlike (delete)
        await prisma.like.delete({
            where: {
            authorId_postId: {
                authorId,
                postId,
            },
            },
        });
    }else{
        // User hasn't liked → create like
        const like=await prisma.like.create({
            data: { 
                authorId,
                postId },
          });
    }
    res.redirect(redirectTo);
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

