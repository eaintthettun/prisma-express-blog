const {PrismaClient}=require('@prisma/client');
const prisma=new PrismaClient();

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