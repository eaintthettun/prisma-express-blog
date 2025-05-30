const {PrismaClient}=require('@prisma/client');
const { name } = require('ejs');
const { post } = require('../routes/postsRoutes');
const prisma=new PrismaClient();

exports.showPostDetails=async(req,res)=>{
    const currentUser=res.locals.currentUser;
    const postId=parseInt(req.params.id);
    const parentId=null;

    const post=await prisma.post.findUnique({
        where:{id:postId},
        include:{
            likes:{
                select:{
                    authorId:true
                }
            },// includes list of users who liked this post
            author:{
                select:{
                    id:true,
                    email:true,
                    name:true,
                    profilePictureUrl:true
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
    const redirectTo = req.header('Referer') || `/posts`; // Fallback to the all posts page
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


//search posts with pagination
let ITEMS_PER_PAGE=5;
exports.searchPosts=async(req,res)=>{
    const page=parseInt(req.query.page) || 1;
    console.log('page',page);
    const skip=(page-1)*ITEMS_PER_PAGE;
    console.log('skip',skip);

    const searchQuery=req.query.search;
    console.log('searchQuery',searchQuery);
    let posts=[];
    if (searchQuery.trim() !== "") {
        posts=await prisma.post.findMany({
            where:{
                OR: [
                    { title: { contains: searchQuery, mode: 'insensitive' } },
                    { content: { contains: searchQuery, mode: 'insensitive' } }
                  ]
            },
            orderBy:{
                createdAt:"desc"
            },
            include:{
                likes:true,
                comments:{
                    select:{
                        content:true,
                        createdAt:true,
                        author:{
                            select:{
                                name:true
                            }
                        }
                    },
                },
                author:{
                    select:{
                        id: true,
                        name: true,
                    }
                },
                category:{
                    select:{
                        name:true
                    }
                },
            },
            skip,
            take:ITEMS_PER_PAGE,
        });
    }
    
    const totalItems=await prisma.post.count({
        where:{
            title:{
                contains:searchQuery,
                mode:"insensitive"
            }
        }
    });
    const totalPages=Math.ceil(totalItems/ITEMS_PER_PAGE);
    
    console.log('search posts:',posts);
    res.render("posts/allPosts",{
        posts,
        currentPage:page,
        totalPages,
        hasNextPage:page<totalPages,
        hasPreviousPage:page>1,
        nextPage:page+1,
        previousPage:page-1,
    });
}

//show all posts including me and other users
exports.listAllPosts=async (req,res)=>{
    let ITEMS_PER_PAGE=5;
    //for pagination
    const page = parseInt(req.query.page) || 1;  // default to page 1
    console.log('index page=',page);
    const skip=(page-1)*ITEMS_PER_PAGE;
    console.log('index skip=',skip);
    

    //show all posts on index.ejs
    try{
        const posts=await prisma.post.findMany({
            include:{
                likes:{
                    select:{
                        authorId:true
                    }
                },// includes list of users who liked this post
                author:{
                    select:{
                        id:true,
                        email:true,
                        name:true,
                        profilePictureUrl:true
                    }
                },
                comments: {
                    include: {
                      commentLikes:true, //include userId and commentId
                      author: true
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
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip,
            take:ITEMS_PER_PAGE,
        });
        //console.log('all posts show:',posts);
        
        const totalItems=await prisma.post.count();
        const totalPages=Math.ceil(totalItems/ITEMS_PER_PAGE);
        
        res.render("posts/allPosts",{posts,
            currentPage:page,
            totalPages,
            hasNextPage:page<totalPages,
            hasPreviousPage:page>1,
            nextPage:page+1,
            previousPage:page-1,
            req
        }); //posts/allPosts.ejs
    
    }catch(error){
        console.error(error);
        res.status(500).send('An error occurred while fetching posts');
    }
}

//sql query (select * from posts where authorId=req.session.userId)
exports.listMyPosts=async (req,res)=>{
    const currentUser=res.locals.currentUser;
    let ITEMS_PER_PAGE=5;

    //for pagination
    const page = parseInt(req.query.page) || 1;  // default to page 1
    //console.log('index page=',page);
    const skip=(page-1)*ITEMS_PER_PAGE;
    //console.log('index skip=',skip);

    const posts=await prisma.post.findMany({
        where:{authorId:req.session.userId},
        include:{
            author:{
                select:{
                    name:true
                }
            },
            likes:{
                select:{
                    authorId:true
                }
            },// includes list of users who liked this post
            comments: {
                include: {
                  commentLikes:{
                    select:{
                        authorId:true
                    }
                  }, //include userId and commentId
                  author: true
                },
                orderBy: {
                  createdAt: 'asc'
                }
            },
            bookmarks:{
                select:{
                    userId:true,
                    postId:true
                }
            },
            category:{
                select:{
                    name:true,
                }
            },
            _count:{
                select:{
                    likes:true,
                    comments:true
                }
            }
        },
        orderBy:{
            createdAt:'asc'
        }
    });

    const totalItems=await prisma.post.count({
        where:{authorId:req.session.userId}
    });

    const totalPages=Math.ceil(totalItems/ITEMS_PER_PAGE);
        
        res.render("posts/myPosts",{posts,
            currentPage:page,
            totalPages,
            hasNextPage:page<totalPages,
            hasPreviousPage:page>1,
            nextPage:page+1,
            previousPage:page-1,
            currentUser
        }); //posts/myPosts.ejs
}

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