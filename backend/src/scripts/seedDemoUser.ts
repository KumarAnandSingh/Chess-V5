/**
 * Seed Demo User for Phase 0 Demo
 * Creates a demo user that can be used for testing Phase 0 features
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDemoUser() {
  try {
    console.log('🌱 Seeding demo user...');

    // Check if demo user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id: 'demo-user-123' }
    });

    if (existingUser) {
      console.log('✅ Demo user already exists');
      return;
    }

    // Create demo user
    const demoUser = await prisma.user.create({
      data: {
        id: 'demo-user-123',
        email: 'demo@chesslabs.com',
        username: 'demo_user',
        displayName: 'Demo User',
        emailVerified: true,
        provider: 'demo',
        providerId: 'demo-123'
      }
    });

    // Create user stats
    await prisma.userStats.create({
      data: {
        userId: demoUser.id,
        totalXP: 150,
        currentLevel: 2,
        levelProgress: 30,
        lessonsCompleted: 2,
        puzzlesSolved: 15,
        currentStreak: 3,
        longestStreak: 7,
        totalTimeSpent: 45, // 45 minutes
        averageAccuracy: 78.5,
        rating: 1150
      }
    });

    // Create user preferences
    await prisma.userPreferences.create({
      data: {
        userId: demoUser.id,
        theme: 'light',
        boardTheme: 'classic',
        pieceSet: 'classic',
        soundEnabled: true
      }
    });

    // Create streak data
    await prisma.streakData.create({
      data: {
        userId: demoUser.id,
        currentStreak: 3,
        longestStreak: 7,
        lastActivityDate: new Date(),
        streakFreezesAvailable: 2
      }
    });

    console.log('✅ Demo user created successfully!');
    console.log(`   - User ID: ${demoUser.id}`);
    console.log(`   - Email: ${demoUser.email}`);
    console.log(`   - Rating: 1150`);
    console.log(`   - Current Streak: 3 days`);

  } catch (error) {
    console.error('❌ Error seeding demo user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedDemoUser();