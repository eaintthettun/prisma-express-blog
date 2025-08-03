const express=require('express');
const router=express.Router();
const topicController=require('../controllers/topicController.js');
const auth=require('../middleware/authMiddleware');

//this controller accepts both categories and topics
//prefix: /topics
router.get('/',topicController.listTopics); //list all categories and topics
router.get('/search',topicController.searchTopic); //carry search word in req.query
router.get('/:slug',topicController.showTopic); //show topic with no. of followers and related stories
router.post('/:topicId/toggle-follow',auth,topicController.toggleFollow);
router.get('/:slug/stories',topicController.showMoreRelatedStories); //you can't use /:id here 

module.exports=router;