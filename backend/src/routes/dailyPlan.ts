/**
 * Daily Plan API Routes
 * Handles "Solve 3 • Learn 1 • Play 1" daily learning plans
 */

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { body, validationResult } from 'express-validator';
import type { Request, Response } from 'express';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/daily-plan
 * Get today's daily plan for the authenticated user
 */
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find or create today's daily plan
    let dailyPlan = await prisma.dailyPlan.findUnique({
      where: {
        userId_date: {
          userId,
          date: today
        }
      }
    });

    if (!dailyPlan) {
      // Create a new daily plan for today
      dailyPlan = await prisma.dailyPlan.create({
        data: {
          userId,
          date: today,
          puzzlesTarget: 3,
          lessonsTarget: 1,
          gamesTarget: 1
        }
      });
    }

    // Calculate completion percentage
    const totalTasks = dailyPlan.puzzlesTarget + dailyPlan.lessonsTarget + dailyPlan.gamesTarget;
    const completedTasks = dailyPlan.puzzlesCompleted + dailyPlan.lessonsCompleted + dailyPlan.gamesCompleted;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Get user stats for hero message
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        streakData: true,
        userStats: true
      }
    });

    // Estimate rating gain for today (based on tasks completed)
    const estimatedRatingGain = completedTasks * 4; // Simple formula: 4 rating points per completed task

    const response = {
      id: dailyPlan.id,
      date: dailyPlan.date,
      tasks: {
        puzzles: {
          target: dailyPlan.puzzlesTarget,
          completed: dailyPlan.puzzlesCompleted,
          remaining: Math.max(0, dailyPlan.puzzlesTarget - dailyPlan.puzzlesCompleted)
        },
        lessons: {
          target: dailyPlan.lessonsTarget,
          completed: dailyPlan.lessonsCompleted,
          remaining: Math.max(0, dailyPlan.lessonsTarget - dailyPlan.lessonsCompleted)
        },
        games: {
          target: dailyPlan.gamesTarget,
          completed: dailyPlan.gamesCompleted,
          remaining: Math.max(0, dailyPlan.gamesTarget - dailyPlan.gamesCompleted)
        }
      },
      progress: {
        completionPercentage,
        xpEarned: dailyPlan.xpEarned,
        estimatedRatingGain,
        isCompleted: completionPercentage === 100,
        completedAt: dailyPlan.completedAt
      },
      streak: {
        current: user?.streakData?.currentStreak || 0,
        longest: user?.streakData?.longestStreak || 0,
        isActive: dailyPlan.streakActive
      },
      heroMessage: generateHeroMessage(dailyPlan, user?.userStats?.rating || 800),
      createdAt: dailyPlan.createdAt,
      updatedAt: dailyPlan.updatedAt
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching daily plan:', error);
    res.status(500).json({ error: 'Failed to fetch daily plan' });
  }
});

/**
 * POST /api/daily-plan/complete-activity
 * Mark an activity as completed (puzzle, lesson, or game)
 */
router.post('/complete-activity', [
  authenticateToken,
  body('activityType').isIn(['puzzle', 'lesson', 'game']).withMessage('Invalid activity type'),
  body('activityId').optional().isString().withMessage('Activity ID must be a string'),
  body('xpEarned').optional().isInt({ min: 0 }).withMessage('XP earned must be a positive integer')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user.userId;
    const { activityType, activityId, xpEarned = 10 } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get or create today's daily plan
    let dailyPlan = await prisma.dailyPlan.findUnique({
      where: {
        userId_date: {
          userId,
          date: today
        }
      }
    });

    if (!dailyPlan) {
      dailyPlan = await prisma.dailyPlan.create({
        data: {
          userId,
          date: today
        }
      });
    }

    // Update the appropriate counter
    const updateData: any = {};
    let taskCompleted = false;

    switch (activityType) {
      case 'puzzle':
        if (dailyPlan.puzzlesCompleted < dailyPlan.puzzlesTarget) {
          updateData.puzzlesCompleted = dailyPlan.puzzlesCompleted + 1;
          taskCompleted = true;
        }
        break;
      case 'lesson':
        if (dailyPlan.lessonsCompleted < dailyPlan.lessonsTarget) {
          updateData.lessonsCompleted = dailyPlan.lessonsCompleted + 1;
          taskCompleted = true;
        }
        break;
      case 'game':
        if (dailyPlan.gamesCompleted < dailyPlan.gamesTarget) {
          updateData.gamesCompleted = dailyPlan.gamesCompleted + 1;
          taskCompleted = true;
        }
        break;
    }

    if (!taskCompleted) {
      return res.status(400).json({ error: 'Activity target already reached for today' });
    }

    // Add XP earned
    updateData.xpEarned = dailyPlan.xpEarned + xpEarned;

    // Check if daily plan is now complete
    const newPuzzlesCompleted = updateData.puzzlesCompleted || dailyPlan.puzzlesCompleted;
    const newLessonsCompleted = updateData.lessonsCompleted || dailyPlan.lessonsCompleted;
    const newGamesCompleted = updateData.gamesCompleted || dailyPlan.gamesCompleted;

    const isNowComplete = (
      newPuzzlesCompleted >= dailyPlan.puzzlesTarget &&
      newLessonsCompleted >= dailyPlan.lessonsTarget &&
      newGamesCompleted >= dailyPlan.gamesTarget
    );

    if (isNowComplete && !dailyPlan.completedAt) {
      updateData.completedAt = new Date();
      updateData.streakActive = true;
      // Bonus XP for completing daily plan
      updateData.xpEarned += 50; // Bonus XP
    }

    // Update daily plan
    const updatedDailyPlan = await prisma.dailyPlan.update({
      where: { id: dailyPlan.id },
      data: updateData
    });

    // Log analytics event
    await prisma.analyticsEvent.create({
      data: {
        userId,
        eventType: isNowComplete ? 'dailyplan_complete' : `${activityType}_complete`,
        eventData: {
          activityType,
          activityId,
          xpEarned,
          dailyPlanId: dailyPlan.id,
          isNowComplete
        }
      }
    });

    // Calculate updated progress
    const totalTasks = updatedDailyPlan.puzzlesTarget + updatedDailyPlan.lessonsTarget + updatedDailyPlan.gamesTarget;
    const completedTasks = updatedDailyPlan.puzzlesCompleted + updatedDailyPlan.lessonsCompleted + updatedDailyPlan.gamesCompleted;
    const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

    res.json({
      success: true,
      dailyPlan: {
        id: updatedDailyPlan.id,
        tasks: {
          puzzles: { completed: updatedDailyPlan.puzzlesCompleted, target: updatedDailyPlan.puzzlesTarget },
          lessons: { completed: updatedDailyPlan.lessonsCompleted, target: updatedDailyPlan.lessonsTarget },
          games: { completed: updatedDailyPlan.gamesCompleted, target: updatedDailyPlan.gamesTarget }
        },
        progress: {
          completionPercentage,
          xpEarned: updatedDailyPlan.xpEarned,
          isCompleted: isNowComplete,
          completedAt: updatedDailyPlan.completedAt
        }
      },
      rewards: isNowComplete ? {
        xpBonus: 50,
        streakUpdated: true,
        title: '🎉 Daily Plan Complete!',
        message: 'You\'ve completed all your daily tasks. Great job!'
      } : null
    });

  } catch (error) {
    console.error('Error completing activity:', error);
    res.status(500).json({ error: 'Failed to complete activity' });
  }
});

/**
 * GET /api/daily-plan/streak
 * Get detailed streak information
 */
router.get('/streak', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user.userId;

    const streakData = await prisma.streakData.findUnique({
      where: { userId }
    });

    if (!streakData) {
      // Create initial streak data
      const newStreakData = await prisma.streakData.create({
        data: {
          userId,
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: new Date(),
          streakFreezesAvailable: 1 // Give 1 free freeze per week
        }
      });

      return res.json({
        current: newStreakData.currentStreak,
        longest: newStreakData.longestStreak,
        lastActivity: newStreakData.lastActivityDate,
        freezesAvailable: newStreakData.streakFreezesAvailable,
        freezesUsed: newStreakData.streakFreezesUsed
      });
    }

    res.json({
      current: streakData.currentStreak,
      longest: streakData.longestStreak,
      lastActivity: streakData.lastActivityDate,
      freezesAvailable: streakData.streakFreezesAvailable,
      freezesUsed: streakData.streakFreezesUsed
    });

  } catch (error) {
    console.error('Error fetching streak data:', error);
    res.status(500).json({ error: 'Failed to fetch streak data' });
  }
});

// Helper functions
function generateHeroMessage(dailyPlan: any, userRating: number) {
  const totalTasks = dailyPlan.puzzlesTarget + dailyPlan.lessonsTarget + dailyPlan.gamesTarget;
  const completedTasks = dailyPlan.puzzlesCompleted + dailyPlan.lessonsCompleted + dailyPlan.gamesCompleted;
  const remainingTasks = totalTasks - completedTasks;

  if (dailyPlan.completedAt) {
    return `🎉 Daily plan complete! You gained +${dailyPlan.xpEarned} XP today.`;
  }

  if (remainingTasks === 0) {
    return `✨ Your daily plan is ready! Complete all tasks to gain ~+12 rating points.`;
  }

  const estimatedTime = remainingTasks * 3; // ~3 minutes per task
  const estimatedRating = remainingTasks * 4; // ~4 rating points per task
  
  return `🎯 Your ${estimatedTime}-min plan is ready → +${estimatedRating} rating expected today!`;
}

export default router;