const {PrismaClient}=require('@prisma/client');
const { name } = require('ejs');
const prisma=new PrismaClient();

exports.listTopics=async(req,res)=>{
    const topics=await prisma.category.findMany();
    res.render('category/exploreCategories',{topics});
}