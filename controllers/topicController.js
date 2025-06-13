const {PrismaClient}=require('@prisma/client');
const { name } = require('ejs');
const prisma=new PrismaClient();

exports.listTopics=async(req,res)=>{
    const categories=await prisma.category.findMany({ //get both categories and topics
        include:{
            topics:{
                select:{
                    id:true,
                    name:true,
                    slug:true,
                }
            }
        }
    });
    res.render('category/allTopics',{categories});
}

exports.showTopic=async(req,res)=>{
    const currentUser=res.locals.currentUser;
    //this id will either category id or topic id
    const slug=req.params.slug;
     
    //to know category or topic ==> need to check slug name
    const categories=res.locals.categories;  //get categories from local storage
    const isCategory=categories.filter(c=>c.slug===slug); 
    console.log('isCategory?:',isCategory);
    if(isCategory){
        let category=await prisma.category.findFirst({
            where:{slug:slug},
            include:{
                posts:{
                    include:{
                        author:{ //to show author profile
                            include:{
                                followers:{
                                    select:{ //to check if you already followed the user
                                        followerId:true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        console.log('category obj:',category);
        return res.render('category/categoryOrTopicDetails',{category,currentUser});
    }else{ //is not category so this is topic
        let topic=await prisma.topic.findFirst({
            where:{slug:slug},
            include:{
                posts:{
                    select:{
                        id:true,
                        title:true,
                        subtitle:true,  //to show related posts
                    }
                }
            }
        });
        return res.render('category/categoryOrTopicDetails',{topic,currentUser});
    }
}

exports.toggleFollow=async(req,res)=>{
    const topicId=parseInt(req.params.id); //this id comes from javascript api path params ${}
    console.log('topicId:',topicId);
    // const authorToFollowId = parseInt(req.body.authorToFollowId); //you will get this id from fetch() in layout.ejs
    // const currentUserId = req.session.userId; // Assuming you store user ID in session

    // console.log("currentUserId:",currentUserId,",authorToFollowId:",authorToFollowId);
    // try {
    //     // Check if already following
    //     const existingFollow = await prisma.userFollow.findUnique({
    //         where: {
    //             followerId_followingId: {
    //                 followerId: currentUserId,
    //                 followingId: authorToFollowId,
    //             },
    //         },
    //     });

    //     if (existingFollow) { //if already following,unfollow it if user clicks unfollow btn
    //         // Unfollow
    //         await prisma.userFollow.delete({
    //             where: {
    //                 followerId_followingId: {
    //                     followerId: currentUserId,
    //                     followingId: authorToFollowId,
    //                 },
    //             },
    //         });
    //         res.json({ followed: false });
    //     } else {
    //         // Follow
    //         await prisma.userFollow.create({
    //             data: {
    //                 followerId: currentUserId,
    //                 followingId: authorToFollowId,
    //             },
    //         });
    //         res.json({followed:true});
    //     }
    // } catch (error) {
    //     console.error('Error toggling follow:', error);
    // }
}