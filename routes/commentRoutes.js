const express=require('express');
const router=express.Router();
const commentController=require('../controllers/commentController.js');
const auth=require('../middleware/authMiddleware');

//prefix: /comments
router.post('/',auth,commentController.processComment);
router.post('/:id/toggle-like',auth,commentController.likeComment); //comment id

module.exports=router;