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

    if (req.session.userId) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.session.userId },
                select: { id: true, name: true } // Select necessary user data
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
    const featuredPost = await prisma.post.findUnique(
        { 
            where: { id: 36 },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        profilePictureUrl: true, // Include author's profile picture if you show it
                    },
                },
                likes: {
                    // Include likes to check if the current user has liked it
                    select: {
                        authorId: true, // Only need the authorId to check for a match
                    },
                },
                _count: {
                    select: {
                        comments: true, // This will give you the count of comments
                    },
                },
                // You might also need categories if displayed on the card
                category: {
                     select: {
                        name: true
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
                select: {
                    id: true,
                    name: true,
                    profilePictureUrl: true, // Include author's profile picture if you show it
                },
            },
            likes: {
                // Include likes to check if the current user has liked it
                select: {
                    authorId: true, // Only need the authorId to check for a match
                },
            },
            _count: {
                select: {
                    comments: true, // This will give you the count of comments
                },
            },
            // You might also need categories if displayed on the card
            category: {
                 select: {
                    name: true
                }
            }
        },
    });
    // Now, when you pass 'posts' to your EJS template:
    // res.render('your_template', { recentPosts: posts, currentUser: req.user });
    // Each 'post' object in 'recentPosts' will have a '_count' property:
    // post._count.comments will hold the number of comments for that post.
    res.render('index',{featuredPost,recentPosts
        ,req:req,
    });
});


  
const PORT=process.env.PORT || 5800;
app.listen(PORT,()=>console.log(`Server running on port http://localhost:${PORT}`));

