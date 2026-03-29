import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'admin@ik-sika.com',
        password: 'admin123',
        name: 'Admin',
        role: UserRole.ADMIN,
        isActive: true,
      },
    });
    console.log('Admin created:', admin.email);

    // Create assistant user
    const assistant = await prisma.user.create({
      data: {
        email: 'assistant@ik-sika.com',
        password: 'assistant123',
        name: 'Assistant',
        role: UserRole.ASSISTANT,
        isActive: true,
      },
    });
    console.log('Assistant created:', assistant.email);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
