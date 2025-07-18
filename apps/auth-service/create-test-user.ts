import bcrypt from 'bcrypt';
import prisma from '../../packages/libs/prisma/index';

async function createTestUser() {
  try {
    console.log('Creating test user for forgot password testing...');

    const email = 'testuser4@hamsoya.com';
    const name = 'Test User 4';
    const password = 'Password123';

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({ where: { email } });

    if (existingUser) {
      console.log('✅ Test user already exists:', email);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    console.log('✅ Test user created successfully!');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   User ID: ${user.id}`);
    console.log(
      '\n🧪 You can now test the forgot password flow with this user.'
    );
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  createTestUser();
}
