const express=require('express');
const router=express.Router();
const authController=require('../controllers/authController.js');
const auth=require('../middleware/authMiddleware');
const upload=require('../middleware/uploadMiddleware.js');

//prefix: /auth
router.get('/register',authController.showRegister); //get method 
router.post('/register',authController.register); //post method
router.get('/login',authController.showLogin);
router.post('/login',authController.login);
router.get('/logout',authController.logout);
router.get('/profile/:id',authController.showProfile); 
router.post('/toggle-follow',auth,authController.toggleFollow); //do not show id of profile user
router.get('/profile/edit/:id',authController.showEditProfile);

//upload.single('file input name) will populate req.file if a file is uploaded.
router.post('/profile/edit/:id',upload.single('profilePicture'),authController.editProfile);

module.exports=router;