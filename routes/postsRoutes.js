const express=require('express');
const router=express.Router();
const postController=require('../controllers/postController.js');
const auth=require('../middleware/authMiddleware');

//prefix: /posts
router.get('/',postController.listAllPosts); //list all posts including me and other users
router.get('/new',auth,postController.showCreateForm); //ui (html links)
router.post('/',auth,postController.createPost);
router.get('/following',auth,postController.getFollowingFeed);
router.get('/edit/:id',auth,postController.showEditForm); //ui(html links)
router.post('/edit/:id',auth,postController.updatePost);
router.post('/delete/:id',auth,postController.deletePost);
router.get('/search',postController.searchPosts);
router.get('/:id',postController.showPostDetails);
router.post('/post/:id/like',auth,postController.likePost); //like,unlike route
router.post('/:id/toggle-bookmark',auth,postController.bookMarkPost);
router.delete('/post/:id',auth,postController.deletePost);

module.exports=router;