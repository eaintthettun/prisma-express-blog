const bcrypt=require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function getFullName(firstName,lastName){
    const fullName = [firstName, lastName].filter(Boolean).join(' '); // handles nulls safely
    return fullName;
}
exports.editProfile = async (req, res) => {
    const userId = parseInt(req.params.id);
    const {
      firstName, lastName, email, country, city, jobPosition,
      company, bio, twitterUrl, linkedinUrl, githubUrl, newPassword
    } = req.body;
  
    const dataToUpdate = {
    };

    // Only add fields if they're not empty
    if (firstName) dataToUpdate.firstName = firstName;
    if (lastName) dataToUpdate.lastName = lastName;
    if (email) dataToUpdate.email = email;
    if (country) dataToUpdate.country = country;
    if(city) dataToUpdate.city=city;
    if (jobPosition) dataToUpdate.jobPosition = jobPosition;
    if (company) dataToUpdate.company = company;
    if (bio) dataToUpdate.bio = bio;
    if (twitterUrl) dataToUpdate.twitterUrl = twitterUrl;
    if (linkedinUrl) dataToUpdate.linkedinUrl = linkedinUrl;
    if (githubUrl) dataToUpdate.githubUrl = githubUrl;
  
    //if firstName or lastName is updated,call helper function and update fullName
    if(firstName || lastName){
        const finalFirstName = firstName || res.locals.currentUser.firstName; //if firstName is not edited, use old firstName in database
        const finalLastName = lastName || res.locals.currentUser.lastName;//if lastName is not edited, use old lastName in database

        const fullName=getFullName(finalFirstName,finalLastName);
        dataToUpdate.name=fullName;
    }

    if (newPassword && newPassword.trim() !== "") {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      dataToUpdate.password = hashedPassword;
    }
    //console.log('req.file is:',req.file);
    if (req.file) {
      dataToUpdate.profilePictureUrl = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate
    });
  
    //console.log('updated user is:', updatedUser);
    req.flash('success','Profile is updated successfully!');
    res.redirect(`/auth/profile/edit/${userId}`); // or wherever your profile page is
};  

exports.showEditProfile=async(req,res)=>{
    const currentUser=res.locals.currentUser;
    res.render('user/editProfile',{currentUser});
}
exports.toggleFollow=async(req,res)=>{
    const authorToFollowId = parseInt(req.body.authorToFollowId); //you will get this id from fetch() in layout.ejs
    const currentUserId = req.session.userId; // Assuming you store user ID in session

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

        if (existingFollow) { //if already following,unfollow it if user clicks unfollow btn
            // Unfollow
            await prisma.userFollow.delete({
                where: {
                    followerId_followingId: {
                        followerId: currentUserId,
                        followingId: authorToFollowId,
                    },
                },
            });
            res.json({ followed: false });
        } else {
            // Follow
            await prisma.userFollow.create({
                data: {
                    followerId: currentUserId,
                    followingId: authorToFollowId,
                },
            });
            res.json({followed:true});
        }
    } catch (error) {
        console.error('Error toggling follow:', error);
    }
}

exports.showProfile=async (req,res)=>{
    let currentUser = res.locals.currentUser; //get user from res.locals
    console.log('current user:',currentUser);
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
            },
            posts:{//to show all posts written by that user
                include:{
                    _count:{
                        select:{
                            likes:true, //to show no. of likes of that post
                            comments:true,  //to show comment count of that post
                        }
                    },
                    author:{
                        select:{
                            id:true,
                            profilePictureUrl:true,
                            followers:true,
                            name:true,
                        }
                    },
                    category:{
                        select:{
                            name:true, //to show category of that post
                        }
                    },
                    likes:{
                        select:{
                            authorId:true,
                        }
                    },
                    bookmarks:{
                        select:{
                            userId:true, //who bookmark this post
                        }
                    }
                }
            }
        }
    });
    res.render('user/profile',{profileUser,currentUser,getReadTime:res.locals.getReadTime,
    });
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

exports.logout=async(req,res)=>{
  req.session.destroy();
  res.redirect('/');
}