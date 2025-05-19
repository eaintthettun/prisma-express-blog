const bcrypt=require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.showProfile=async (req,res)=>{
    const user=await prisma.user.findUnique({
        where:{id:parseInt(req.params.id)},
        include:{
            posts:true
        }
    });
    const categories=await prisma.category.findMany({
    });
    res.render('user/profile',{user,categories});
}
exports.showRegister=async(_,res)=>{
    const categories=await prisma.category.findMany({
    });
    res.render('auth/register',{title:'Register',categories}); //register.ejs(view)
}
exports.register=async (req,res)=>{
    const {name,email,password}=req.body;
    try{
        //check user by email
        const existingUser=await prisma.user.findUnique({
            where:{email}
        }); 
        if(existingUser){
            return res.status(400).render('auth/register',{
                title:'Register',
                error:'Email already in use'
            });
        }
        //hash password
        const hashedPassword=await bcrypt.hash(password,10);
        //create new user
        await prisma.user.create({
            data:{name,email,password:hashedPassword} //key:value object
        });
        res.redirect('/auth/login');    
    }catch(error){
        console.error('Error during registration:',error);
        res.status(500).json({message:'Error registering user'});
    }
}
exports.showLogin=(req,res)=>{
    res.render('auth/login',{title:'Login'}); //view login form
}
exports.login=async (req,res)=>{
    const {email,password}=req.body;
    const user=await prisma.user.findUnique({where:{email}});
    if(!user){
            return res.status(401).render(
                'auth/login',{
                    title:'Login',
                    error:"Email not found"
                }
            );
    }
    //email correct,also check user
    //login success
    if(user && await bcrypt.compare(password,user.password)){
        console.log('login success',user,password);
        req.session.userId=user.id;
        req.session.role="Super Admin";
        const posts=await prisma.post.findMany({
            where:{authorId:req.session.userId},
            include:{
                author:true
            }
        });
        const categories=await prisma.category.findMany();
        console.log(posts)
        return res.redirect('/');
    }
    res.redirect('/auth/login');
}

exports.logout=(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/'); //return to index.ejs
    })
}