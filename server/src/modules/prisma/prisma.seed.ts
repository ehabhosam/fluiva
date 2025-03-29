import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  // check if the database already has the default categories
  const categories = await prisma.category.findMany({
    where: {
      default: true,
    },
  });

  if (categories.length < 6) {
    console.log('Creating default categories...');
    const respnose = await prisma.category.createMany({
      data: [
        {
          name: 'work',
          image_url: 'https://i.ibb.co/x6yrZ6M/work.jpg',
          default: true,
        },
        {
          name: 'fitness',
          image_url: 'https://i.ibb.co/0mP96hb/fitness.jpg',
          default: true,
        },
        {
          name: 'academic',
          image_url: 'https://i.ibb.co/nbxt7N0/academic.jpg',
          default: true,
        },
        {
          name: 'creativity',
          image_url: 'https://i.ibb.co/zPCJzTs/creativity.jpg',
          default: true,
        },
        {
          name: 'religious',
          image_url: 'https://i.ibb.co/94kxtVW/religious.jpg',
          default: true,
        },
        {
          name: 'custom',
          image_url: 'https://i.ibb.co/mFbtZyz/self-growth.jpg',
          default: true,
        },
      ],
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
