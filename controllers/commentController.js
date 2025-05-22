const {PrismaClient}=require('@prisma/client');
const prisma=new PrismaClient();

exports.likeComment=async (req,res)=>{
  const commentId = parseInt(req.params.id);
  const authorId = req.session.userId;

  
  const existingCommentLike = await prisma.commentLike.findUnique({
    where: {
      authorId_commentId: {
        authorId,
        commentId
      }
    }
  });

  if (existingCommentLike) {
    // Unlike
    await prisma.commentLike.delete({
      where: {
        id: existingCommentLike.id
      }
    });
  } else {
    // Like
    const commentLike=await prisma.commentLike.create({
      data: {
        authorId,
        commentId
      }
    });
    //console.log('comment like:',commentLike);
  }

  res.redirect('/'); // return to the same page
}

//sql query (select * from posts where authorId=req.session.userId)
exports.processComment=async (req,res)=>{
    const { postId, comment } = req.body;
  const userId = req.session.userId; // or however you store logged-in user
    console.log('req body is:',req.body);
  if (!userId) {
    return res.redirect('/auth/login');
  }

  try {
    await prisma.comment.create({
      data: {
        content: comment,
        postId: parseInt(postId),
        authorId: userId
      }
    });

    res.redirect('/');
  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(500).send('Something went wrong');
  }
}