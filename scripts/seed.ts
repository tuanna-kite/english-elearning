/* eslint-disable @typescript-eslint/no-var-requires */
const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function main() {
  try {
    await db.category.createMany({
      data: [
        { name: 'TOEIC' },
        { name: 'IELTS' },
        { name: 'TOEFL' },
        { name: 'SAT' },
      ],
    });
    console.log('Categories seeded successfully');
  } catch (error) {
    console.error(error);
  } finally {
    await db.$disconnect();
  }
}

main();
