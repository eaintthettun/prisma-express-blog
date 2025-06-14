const {PrismaClient}=require('@prisma/client');
const { name } = require('ejs');
const prisma=new PrismaClient();
const getPostsQuery=require('../utils/getPosts');

//to use this method across all topic methods
const getCategory=async (options = {}) => {
  const {
    where = {},         // custom filters (e.g. { slug: business }
  } = options;

  return await prisma.category.findFirst({
    where,
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
            },
            likes: {
              select: { authorId: true }
            },
            comments: {
              include: {
                commentLikes: true,
                author: true
              },
              orderBy: {
                createdAt: 'asc'
              }
            },
            bookmarks: {
              select: {
                userId: true,
                postId: true
              }
            },
            _count: {
              select: {
                likes: true,
                comments: true
              }
            }
        }
    },
        _count:{
          select:{
              followedBy:true,
              posts:true,
          }
        }
    },
});
}

//to use this method across all topic methods
const getTopic=async(options = {}) => {
  const {
    where = {},         // custom filters (e.g. { slug: business }
  } = options;

  return await prisma.topic.findFirst({
    where,
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
                },
                likes: {
                  select: { authorId: true }
                },
                comments: {
                  include: {
                    commentLikes: true,
                    author: true
                  },
                  orderBy: {
                    createdAt: 'asc'
                  }
                },
                bookmarks: {
                  select: {
                    userId: true,
                    postId: true
                  }
                },
                _count: {
                  select: {
                    likes: true,
                    comments: true
                  }
                }
            }
        },
        _count:{
            select:{
                followedBy:true,
                posts:true,
            }
        }
    },
});
}

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
    const isCategory = categories.find(c => c.slug === slug);
    //console.log('isCategory?:',isCategory);
    if(isCategory){
      //get category first ,then you can call category.posts to get posts
        let category=await getCategory({where:{slug:slug}});
        console.log('category length:',category.posts.length);
        return res.render('category/categoryOrTopicDetails',
            {isCategory,category,currentUser});
    }else{ //is not category so this is topic
        let topic=await getTopic({where:{slug:slug}});
        return res.render('category/categoryOrTopicDetails',{isCategory,topic,currentUser});
    }
}  

exports.toggleFollow=async(req,res)=>{
        const topicToFollowId = parseInt(req.params.topicId); //this id is from ajax api ${topicId}
        const currentUserId = req.session.userId;
      
        console.log("currentUserId:", currentUserId, ", topicToFollowId:", topicToFollowId);
      
        try {
          const existingFollow = await prisma.topicFollow.findUnique({
            where: {
              userId_topicId: {
                userId: currentUserId,
                topicId: topicToFollowId,
              },
            },
          });
      
          if (existingFollow) {
            // Unfollow
            await prisma.topicFollow.delete({
              where: {
                userId_topicId: {
                  userId: currentUserId,
                  topicId: topicToFollowId,
                },
              },
            });
            const count = await prisma.topicFollow.count({
              where: { topicId: topicToFollowId }
            });
            res.json({ followed: false, followersCount: count });
          } else {
            // Follow
            await prisma.topicFollow.create({
              data: {
                userId: currentUserId,
                topicId: topicToFollowId,
              },
            });
            const count = await prisma.topicFollow.count({
              where: { topicId: topicToFollowId }
            });
            res.json({ followed: true, followersCount: count });
          }
        } catch (error) {
          console.error("Toggle follow error:", error);
        }
}

exports.showMoreRelatedStories=async(req,res)=>{
  const currentUser=res.locals.currentUser;
  const slug=req.params.slug;
  
  //to know category or topic ==> need to check slug name
  const categories=res.locals.categories;  //get categories from local storage
  const isCategory = categories.find(c => c.slug === slug);
  if(isCategory){
    //get category first ,then you can call category.posts to get posts
      let category=await getCategory({where:{slug:slug}});
      return res.render('category/relatedPosts',
          {isCategory,category,currentUser});
  }else{ //is not category so this is topic
      let topic=await getTopic({where:{slug:slug}});
      return res.render('category/relatedPosts',{isCategory,topic,currentUser});
  }
}