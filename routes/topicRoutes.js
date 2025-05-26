const express=require('express');
const router=express.Router();
const topicController=require('../controllers/topicController.js');

//prefix: /topics
router.get('/',topicController.listTopics); //get method 



module.exports=router;