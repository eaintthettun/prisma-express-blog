const express=require('express');
const app=express();
const path=require('path');
const dotenv=require('dotenv');
const session=require('express-session');
const expressLayouts=require('express-ejs-layouts');
const {PrismaClient}=require("@prisma/client");
const prisma = new PrismaClient();
const authRoutes=require('./routes/authRoutes');
const postRoutes=require('./routes/postsRoutes');
const commentRoutes=require('./routes/commentRoutes');
const auth=require('./middleware/authMiddleware');
const { fi } = require('@faker-js/faker');

dotenv.config();
app.set('view engine','ejs');
app.set('views',path.join(__dirname,"views")); 
app.use(express.urlencoded({extended:true}));
app.use(express.static('public')); //D:\JavaScript online class workspace\prisma-express-blog\public
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false
}));
app.use(async(req,res,next)=>{
    res.locals.userId=req.session.userId; //important session key
    // Make selectedCategory and categories available to all views
    res.locals.selectedCategory = req.query.categoryId || "";
    res.locals.categories = await prisma.category.findMany();
    next();
});


app.use('/auth',authRoutes);
app.use('/posts',postRoutes); //only write posts when only login
app.use('/comments',commentRoutes);

  
let ITEMS_PER_PAGE=5;
app.get('/',async(req,res)=>{
    //for pagination
    const page = parseInt(req.query.page) || 1;  // default to page 1
    console.log('index page',page);
    const skip=(page-1)*ITEMS_PER_PAGE;
    console.log('index skip',skip);
    
    const categoryId = parseInt(req.query.categoryId);
    const search = req.query.search || "";
    const filter = {
        ...(categoryId ? { categoryId: categoryId } : {}), //if category is selected
        ...(search ? { //if search is done
            OR: [
                { title: { contains: search, mode: "insensitive" } },
                { content: { contains: search, mode: "insensitive" } }
            ]
        } : {})
      };
    //show all posts on index.ejs
    try{
        const posts=await prisma.post.findMany({
            where:filter,
            include:{
                likes:true,// includes list of users who liked this post
                author:{
                    select:{
                        email:true,
                        name:true
                    }
                },
                comments: {
                    include: {
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
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip,
            take:ITEMS_PER_PAGE,
        });
        //console.log('all posts show:',posts);
        
        const totalItems=await prisma.post.count({
            where:filter
        }
        );
        const totalPages=Math.ceil(totalItems/ITEMS_PER_PAGE);
        
        res.render("index",{posts,
            currentPage:page,
            totalPages,
            hasNextPage:page<totalPages,
            hasPreviousPage:page>1,
            nextPage:page+1,
            previousPage:page-1,
            currentUserId:req.session.userId
        });
    
    }catch(error){
        console.error(error);
        res.status(500).send('An error occurred while fetching posts');
    }
});
const PORT=process.env.PORT || 5800;
app.listen(PORT,()=>console.log(`Server running on port http://localhost:${PORT}`));
