const express=require('express');
const router=express.Router();
const authController=require('../controllers/authController.js');
const auth=require('../middleware/authMiddleware');

//prefix: /auth
router.get('/register',authController.showRegister); //get method 
router.post('/register',authController.register); //post method
router.get('/login',authController.showLogin);
router.post('/login',authController.login);
router.get('/logout',authController.logout);
router.get('/profile/:id',authController.showProfile); 
router.post('/toggle-follow',auth,authController.toggleFollow); //do not show id of profile user

module.exports=router;