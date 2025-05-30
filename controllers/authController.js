const bcrypt=require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.toggleFollow=async(req,res)=>{
    const authorToFollowId = parseInt(req.body.authorToFollowId); //you will get this id from hidden
    const currentUserId = req.session.userId; // Assuming you store user ID in session
    const redirectTo = req.header('Referer') || `/posts`; // Fallback to the all posts page

    console.log("currentUserId:",currentUserId,",authorToFollowId:",authorToFollowId);
    try {
        // Check if already following
        const existingFollow = await prisma.userFollow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: currentUserId,
                    followingId: authorToFollowId,
                },
            },
        });

        if (existingFollow) {
            // Unfollow
            await prisma.userFollow.delete({
                where: {
                    followerId_followingId: {
                        followerId: currentUserId,
                        followingId: authorToFollowId,
                    },
                },
            });
            res.redirect(redirectTo);
        } else {
            // Follow
            await prisma.userFollow.create({
                data: {
                    followerId: currentUserId,
                    followingId: authorToFollowId,
                },
            });
            res.redirect(redirectTo);
        }
    } catch (error) {
        console.error('Error toggling follow:', error);
    }
}

exports.showProfile=async (req,res)=>{
    let currentUser = res.locals.currentUser; //get user from res.locals
    const profileUser=await prisma.user.findUnique({
        where:{id:parseInt(req.params.id)}, //need to know profile user id to get his info
        include:{
            _count:{
                select:{
                    posts:true,
                    followers:true
                }
            },
            followers:{
                select:{
                    followerId:true //to check if the currentUser is already following profileUser or not
                }
            }
        }
    });
    //console.log('profile user is:',profileUser);
    res.render('user/profile',{profileUser,currentUser});
}

exports.showRegister=async(_,res)=>{
    const categories=await prisma.category.findMany({
    });
    res.render('auth/register',{title:'Register',categories,layout:false}); //register.ejs(view)
}

exports.register=async (req,res)=>{
    const {name,email,password,profilePictureUrl,title,bio,githubUrl,twitterUrl,linkedinUrl}=req.body;
    try{
        //check user by email
        const existingUser=await prisma.user.findUnique({
            where:{email}
        }); 
        if(existingUser){
            return res.status(400).render('auth/register',{
                title:'Register',
                error:'Email already in use',
            });
        }
        //hash password
        const hashedPassword=await bcrypt.hash(password,10);
        //create new user
        await prisma.user.create({
            data:{name,email,password:hashedPassword,
                profilePictureUrl,title,bio,githubUrl,twitterUrl,linkedinUrl
            } //key:value object
        });
        res.redirect('/auth/login');    
    }catch(error){
        console.error('Error during registration:',error);
        res.status(500).json({message:'Error registering user'});
    }
}
exports.showLogin=(req,res)=>{
    res.render('auth/login',{title:'Login',layout:false}); //view login form
}
exports.login=async (req,res)=>{
    const {email,password}=req.body;
    const user=await prisma.user.findUnique({where:{email}});
    if(!user){
            return res.status(401).render(
                'auth/login',{
                    title:'Login',
                    error:"Email not found",
                }
            );
    }
    //email correct,also check user
    //login success
    if(user && await bcrypt.compare(password,user.password)){
        console.log('login success',user,password);
        req.session.userId=user.id;
        req.session.role="Super Admin";
        return res.redirect('/');
    }
    res.redirect('/auth/login');
}

exports.logout=(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/'); //return to index.ejs
    })
}