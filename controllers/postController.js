const {PrismaClient}=require('@prisma/client');
const { name } = require('ejs');
const prisma=new PrismaClient();

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
                        name:true
                    }
                },
                category:{
                    select:{
                        name:true
                    }
                }
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
    res.render("index",{
        posts,
        currentPage:page,
        totalPages,
        hasNextPage:page<totalPages,
        hasPreviousPage:page>1,
        nextPage:page+1,
        previousPage:page-1,
    });
}
//sql query (select * from posts where authorId=req.session.userId)
exports.listPosts=async (req,res)=>{
    const posts=await prisma.post.findMany({
        where:{authorId:req.session.userId},
        include:{
            comments:{
                include:{
                    author:true
                },
                orderBy:{
                    createdAt:'asc'
                }
            }
        },
        orderBy:{
            createdAt:'asc'
        }
    });
    res.render('posts/list',{posts});
}

exports.showCreateForm=async(req,res)=>{
    const categories=await prisma.category.findMany();
    res.render('posts/create',{categories});
}

exports.createPost=async (req,res)=>{
    const {title,content,categoryId}=req.body;
    await prisma.post.create({
        data:{
            title,
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