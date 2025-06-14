const express=require('express');
const router=express.Router();
const postController=require('../controllers/postController.js');
const auth=require('../middleware/authMiddleware');

//prefix: /posts
router.get('/',postController.listAllPosts); //list all posts including me and other users
router.get('/myPosts',auth,postController.listMyPosts); //list my posts
router.get('/new',auth,postController.showCreateForm); //ui (html links)
router.post('/',auth,postController.createPost);
router.get('/edit/:id',auth,postController.showEditForm); //ui(html links)
router.post('/edit/:id',auth,postController.updatePost);
router.post('/delete/:id',auth,postController.deletePost);
router.get('/search',postController.searchPosts);
router.post('/:id/toggle-like',auth,postController.likePost); //post id
router.post('/:id/toggle-bookmark',auth,postController.bookMarkPost);
router.get('/:id',postController.showPostDetails);


module.exports=router;