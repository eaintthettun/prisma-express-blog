const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//show all posts including me and other users
function time_to_read(text, wordsPerMinute = 200) {
  const words = text?.trim().split(/\s+/).length || 0;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

const getPostsQuery = async (options = {}) => {
  const {
    skip = 0,
    take = 5, 
    where = {},         // custom filters (e.g. { authorId: 123 }, { title: { contains: 'javascript' } })
  } = options;

  let posts = await prisma.post.findMany({
    where,//if exists,take where 
    include: {
      likes: {
        select: { authorId: true }
      },
      author: {
        include: { followers: true }
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
      category: {
        select: { name: true }
      },
      topic:{
        select:{ name:true }
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
    },
    orderBy: {
      createdAt: 'desc'
    },
    skip,
    take
  });


  return posts.map(post => ({
    ...post,
    readTime: time_to_read(post.content)
  }));;
};

module.exports = getPostsQuery;
