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
const topicRoutes=require('./routes/topicRoutes');
const auth=require('./middleware/authMiddleware');
const { fi } = require('@faker-js/faker');
const multer = require('multer'); //for file upload,use this package
const flash = require('connect-flash');

dotenv.config();
app.set('view engine','ejs');
app.set('views',path.join(__dirname,"views")); 
app.use(express.json());
app.use(expressLayouts); 
app.set('layout', 'layout'); // Specify your default layout file (e.g., views/layout.ejs)
app.use(express.urlencoded({extended:true}));
app.use(express.static('public')); //D:\JavaScript online class workspace\prisma-express-blog\public
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

//flash middleware
app.use(flash());

//declare getReadTime in app.js and store it in middleware(res.locals)
function getReadTime(text) {
    const wordsPerMinute = 200; // average reading speed
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
}


app.use(async(req,res,next)=>{
    // Make flash messages available in all EJS templates
    res.locals.successMessage = req.flash('success');
    res.locals.errorMessage = req.flash('error');
    
    res.locals.getReadTime=getReadTime; //to use getReadTime globally across EJS templates
    if (!req.session.likedPosts) {
        req.session.likedPosts = []; // store post IDs liked but not saved yet
    }
    res.locals.userId=req.session.userId; //important session key
    // Make selectedCategory and categories available to all views
    res.locals.selectedCategory = req.query.categoryId || "";
    res.locals.categories = await prisma.category.findMany({
        include:{
            _count:{
                select:{
                    posts:true,
                } //get no. of posts related with that category
            }
        }
    });

    if (req.session.userId) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.session.userId },
                include:{
                    followers:{
                        select:{
                            followerId:true,
                        }
                    }
                },
            });
            res.locals.currentUser = user;
        } catch (error) {
            console.error("Error fetching user for header:", error);
            res.locals.currentUser = null; // Ensure it's null on error too
        }
    } else {
        res.locals.currentUser = null; // No user logged in
    }
    next();
});

app.use('/auth',authRoutes);
app.use('/posts',postRoutes); //only write posts when only login
app.use('/comments',commentRoutes);
app.use('/topics',topicRoutes);

app.get('/',async(req,res)=>{
    const currentUser=res.locals.currentUser;
    const featuredPost = await prisma.post.findUnique(
        { 
            where: { id: 36 },
            include: {
                author:{
                    include:{
                        followers:{
                            select:{
                                followerId:true, //to check if you are following this user or not
                            }
                        }
                    }
                },
                likes: {
                    // Include likes to check if the current user has liked it
                    select: {
                        authorId: true, // Only need the authorId to check for a match
                    },
                },
                bookmarks:{
                    select:{
                        userId:true,
                    }
                },
                _count: {
                    select: {
                        likes:true,
                        comments: true, // This will give you the count of comments
                    },
                },
                // You might also need categories if displayed on the card
                category: {
                     select: {
                        name: true,
                        slug:true,
                    }
                }
            },
        }
    ); 

    const recentPosts = await prisma.post.findMany({
        orderBy: 
        { createdAt: 'desc' },
        take: 2,
        include: {
            author: {
                include:{
                    followers:{
                        select:{
                            followerId:true,  //to check if you are following this user or not
                        }
                    }
                }
            },
            likes: {
                // Include likes to check if the current user has liked it
                select: {
                    authorId: true, // Only need the authorId to check for a match
                },
            },
            bookmarks:{
                select:{
                    userId:true,
                }
            },
            _count: {
                select: {
                    likes:true,
                    comments: true, // This will give you the count of comments
                },
            },
            // You might also need categories if displayed on the card
            category: {
                 select: {
                    name: true,
                    slug:true,
                }
            }
        },
    });
    res.render('index',{currentUser,featuredPost,recentPosts,getReadTime:res.locals.getReadTime
    });
});


  
const PORT=process.env.PORT || 5800;
app.listen(PORT,()=>console.log(`Server running on port http://localhost:${PORT}`));

