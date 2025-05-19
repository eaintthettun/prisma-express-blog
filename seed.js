const { PrismaClient } = require('@prisma/client');
const prisma=new PrismaClient();
const bcrypt=require('bcryptjs');
const {faker}=require('@faker-js/faker');

async function seedUsers(count) {
    const users=[];
    for (let i = 0; i < count; i++) {
        users.push({
            name:faker.person.fullName(),
            email:faker.internet.email(),
            password:await bcrypt.hash('password',10)
        })
    }
    try{
        await prisma.user.createMany({
            data:users
        });
        console.log(`successfully seeded ${count} users`);
    }catch(error){
        console.log('Error seeding users:',error);
    }
}

async function seedPosts(count){
    const posts=[];
    for (let i = 0; i < count; i++) {
        const user=await prisma.user.findFirst({
            select:{
                id:true
            }
        });

        if(!user){
            throw new Error('No users found');
        }
        posts.push({
            title:faker.lorem.sentence(),
            content:faker.lorem.paragraph(),
            authorId:user.id
        })
    }
    try{
        await prisma.post.createMany({
            data:posts
        });
        console.log(`successfully seeded ${count} posts`);
    }catch(error){
        console.log('Error seeding posts:',error);
    }
}

//run the seeding sequentially
async function runSeed() {
    try{
        await seedUsers(10); //wait for users to be seeded
        await seedPosts(20); //then seed posts
    }catch(error){
        console.log('Error during seeding:',error);
    }
}

runSeed()
  .then(() => {
    console.log("✅ Seeding complete");
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    prisma.$disconnect();
    process.exit(1);
  });
