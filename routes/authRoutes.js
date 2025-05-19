const express=require('express');
const router=express.Router();
const authController=require('../controllers/authController.js');

//prefix: /auth
router.get('/register',authController.showRegister); //get method 
router.post('/register',authController.register); //post method
router.get('/login',authController.showLogin);
router.post('/login',authController.login);
router.get('/logout',authController.logout);
router.get('/profile/:id',authController.showProfile);

module.exports=router;