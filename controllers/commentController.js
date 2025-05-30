const {PrismaClient}=require('@prisma/client');
const prisma=new PrismaClient();

exports.likeComment=async (req,res)=>{
  const redirectTo = req.header('Referer') || `/posts`; // Fallback to the all posts page
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

  res.redirect(redirectTo); // return to the same page
}

//sql query (select * from posts where authorId=req.session.userId)
exports.processComment=async (req,res)=>{
  console.log('reply to a reply loaded');
  const redirectTo = req.header('Referer') || `/posts`; // Fallback to the all posts page
   // 1. Extract data from the request body
   const { postId, parentId, content } = req.body; // parentId will be present for replies
   const currentUserId = req.session.userId; // Assuming you store userId in session after login

   // Optional: Log received data for debugging
   console.log('Received comment data:', { postId, parentId, content, currentUserId });

   try {
       // 4. Create the comment in the database using Prisma
       const newComment = await prisma.comment.create({
           data: {
               content: content,
               postId: parseInt(postId),
               authorId: currentUserId,
               // CRUCIAL: Handle parentId for nesting
               // If parentId is provided and is a non-empty string, use it.
               // Otherwise, set it to null for top-level comments.
               parentId: parentId ? parseInt(parentId) : null,
           },
       });

       console.log('New comment created:', newComment);

       // 5. Redirect back to the post details page
       // It's common practice to redirect back to the page the user came from
       // to show the newly added comment.
       res.redirect(redirectTo);

   } catch (error) {
       console.error('Error creating comment:', error);

       // More specific error handling could be added here,
       // e.g., checking for Prisma client known errors.
       res.status(500).send('Error creating comment. Please try again.');
   }
}