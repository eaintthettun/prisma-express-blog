const { PrismaClient } = require('@prisma/client');
const prisma=new PrismaClient();
const bcrypt=require('bcryptjs');
const {faker}=require('@faker-js/faker');
const slugify=require('slugify');

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



const options = { //slugify options
    lower: true,
    strict: true // Removes special characters
}

async function seedCategoriesTopics() {
    const data = [
        {
          name: 'Business',
          topics: ['Entrepreneurship', 'Freelancing', 'Small Business', 'Startups', 'Venture Capital']
        },
        {
          name: 'Technology',
          topics: ['Artificial Intelligence', 'Programming', 'Data Science', 'Cybersecurity', 'Gadgets']
        },
        {
          name: 'Self Improvement',
          topics: ['Productivity', 'Mindfulness', 'Motivation', 'Habits', 'Time Management']
        },
        {
          name: 'Writing',
          topics: ['Blogging', 'Creative Writing', 'Poetry', 'Screenwriting', 'Journalism']
        },
        {
          name: 'Finance',
          topics: ['Personal Finance', 'Investing', 'Crypto', 'Financial Planning', 'Stock Market']
        },
        {
          name: 'Design',
          topics: ['UI/UX', 'Graphic Design', 'Web Design', 'Typography', 'Branding']
        },
        {
          name: 'Education',
          topics: ['Online Learning', 'Study Tips', 'Teaching', 'EdTech', 'Learning Languages']
        }
      ]
    
      for (const category of data) {
        const categorySlug = slugify(category.name, options)
    
        await prisma.category.create({
          data: {
            name: category.name,
            slug: categorySlug,
            topics: {
              create: category.topics.map(topic => ({
                name: topic,
                slug: slugify(topic, options)
              }))
            }
          }
        })
      }
    
      console.log('✅ Categories and topics with slugs seeded!')
}
//run the seeding sequentially
async function runSeed() {
    try{
        // await seedUsers(10); //wait for users to be seeded
        // await seedPosts(20); //then seed posts
        await seedCategoriesTopics();
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
