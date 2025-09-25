/**
 * Calibration API Routes
 * Handles 12-position strength test to determine user's tactics rating and weak motifs
 */

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { body, validationResult } from 'express-validator';
// Chess engine is used for validation but not needed for basic calibration
import type { Request, Response } from 'express';

const router = Router();
const prisma = new PrismaClient();

// Calibration positions - carefully selected tactical positions of varying difficulty
const CALIBRATION_POSITIONS = [
  // Position 1: Basic Fork (400-600 ELO)
  {
    position: 1,
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 4",
    correctMove: "Bxf7+",
    theme: "fork",
    difficulty: 1,
    timeLimit: 30,
    description: "White to play - find the knight fork"
  },
  // Position 2: Simple Pin (500-700 ELO)
  {
    position: 2,
    fen: "r1bqk2r/ppp2ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 b kq - 0 6",
    correctMove: "Bg4",
    theme: "pin",
    difficulty: 2,
    timeLimit: 45,
    description: "Black to play - pin the knight"
  },
  // Position 3: Back Rank Mate (600-800 ELO)
  {
    position: 3,
    fen: "6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
    correctMove: "Re8+",
    theme: "back_rank",
    difficulty: 2,
    timeLimit: 30,
    description: "White to play - exploit the back rank"
  },
  // Position 4: Discovered Attack (700-900 ELO)
  {
    position: 4,
    fen: "r1bq1rk1/ppp2ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 8",
    correctMove: "Nd5",
    theme: "discovered_attack",
    difficulty: 3,
    timeLimit: 60,
    description: "White to play - find the discovered attack"
  },
  // Position 5: Skewer (800-1000 ELO)
  {
    position: 5,
    fen: "4r1k1/1q3ppp/p7/3Qp3/8/1P6/P4PPP/2R3K1 w - - 0 20",
    correctMove: "Qd8+",
    theme: "skewer",
    difficulty: 3,
    timeLimit: 45,
    description: "White to play - force a skewer"
  },
  // Position 6: Double Attack (900-1100 ELO)
  {
    position: 6,
    fen: "r3k2r/ppp2ppp/2n1bn2/2bpp3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 8",
    correctMove: "Nd5",
    theme: "double_attack",
    difficulty: 4,
    timeLimit: 75,
    description: "White to play - create multiple threats"
  },
  // Position 7: Deflection (1000-1200 ELO)
  {
    position: 7,
    fen: "2rq1rk1/1b2bppp/p2p1n2/1p2pP2/4P3/1BP2N2/PP1Q2PP/2RR2K1 w - - 0 18",
    correctMove: "Bxf7+",
    theme: "deflection",
    difficulty: 4,
    timeLimit: 90,
    description: "White to play - deflect the defender"
  },
  // Position 8: Decoy (1100-1300 ELO)
  {
    position: 8,
    fen: "r4rk1/1bq2ppp/p2p1n2/1p2pP2/4P3/1BP2N2/PP1Q2PP/2RR2K1 b - - 0 18",
    correctMove: "Qc2",
    theme: "decoy",
    difficulty: 4,
    timeLimit: 90,
    description: "Black to play - decoy the queen"
  },
  // Position 9: Clearance (1200-1400 ELO)
  {
    position: 9,
    fen: "r2qkb1r/pb1n1ppp/1p2pn2/3pP3/2pP4/2N2N2/PP2BPPP/R1BQK2R w KQkq - 0 9",
    correctMove: "Nd5",
    theme: "clearance",
    difficulty: 5,
    timeLimit: 120,
    description: "White to play - clear the way for attack"
  },
  // Position 10: Interference (1300-1500 ELO)
  {
    position: 10,
    fen: "2kr3r/pppq1ppp/2n1bn2/2bpp3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R b KQ - 0 8",
    correctMove: "Nd4",
    theme: "interference",
    difficulty: 5,
    timeLimit: 120,
    description: "Black to play - interfere with White's coordination"
  },
  // Position 11: Zugzwang (1400-1600 ELO)
  {
    position: 11,
    fen: "8/8/1p1k4/1P6/2PK4/8/8/8 w - - 0 1",
    correctMove: "Kd3",
    theme: "zugzwang",
    difficulty: 6,
    timeLimit: 150,
    description: "White to play - put opponent in zugzwang"
  },
  // Position 12: Complex Combination (1500+ ELO)
  {
    position: 12,
    fen: "r4rk1/1bq1bppp/p2ppn2/1p6/3NPP2/1BP2R2/PP1Q2PP/2R3K1 w - - 0 18",
    correctMove: "Nf5",
    theme: "combination",
    difficulty: 6,
    timeLimit: 180,
    description: "White to play - find the winning combination"
  }
];

/**
 * GET /api/calibration/start
 * Start a new calibration test or get current progress
 */
router.get('/start', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user.userId;

    // Check if user already has a calibration in progress or completed
    const existingCalibration = await prisma.userCalibration.findUnique({
      where: { userId }
    });

    if (existingCalibration && existingCalibration.completedAt) {
      return res.json({
        status: 'completed',
        tacticsRating: existingCalibration.tacticsRating,
        weakMotifs: existingCalibration.weakMotifs,
        completedAt: existingCalibration.completedAt,
        message: 'Calibration already completed. Rating: ' + existingCalibration.tacticsRating
      });
    }

    if (existingCalibration && !existingCalibration.completedAt) {
      // Continue existing calibration
      const currentPosition = CALIBRATION_POSITIONS.find(p => p.position === existingCalibration.position);
      if (!currentPosition) {
        return res.status(500).json({ error: 'Invalid calibration state' });
      }

      return res.json({
        status: 'in_progress',
        position: existingCalibration.position,
        fen: currentPosition.fen,
        theme: currentPosition.theme,
        difficulty: currentPosition.difficulty,
        timeLimit: currentPosition.timeLimit,
        description: currentPosition.description,
        totalPositions: CALIBRATION_POSITIONS.length,
        progress: existingCalibration.position
      });
    }

    // Start new calibration
    const firstPosition = CALIBRATION_POSITIONS[0];
    const newCalibration = await prisma.userCalibration.create({
      data: {
        userId,
        position: 1,
        fen: firstPosition.fen,
        correctMove: firstPosition.correctMove
      }
    });

    // Log analytics event
    await prisma.analyticsEvent.create({
      data: {
        userId,
        eventType: 'calibration_start',
        eventData: {
          calibrationId: newCalibration.id
        }
      }
    });

    res.json({
      status: 'started',
      position: 1,
      fen: firstPosition.fen,
      theme: firstPosition.theme,
      difficulty: firstPosition.difficulty,
      timeLimit: firstPosition.timeLimit,
      description: firstPosition.description,
      totalPositions: CALIBRATION_POSITIONS.length,
      progress: 1
    });

  } catch (error) {
    console.error('Error starting calibration:', error);
    res.status(500).json({ error: 'Failed to start calibration' });
  }
});

/**
 * POST /api/calibration/submit-move
 * Submit a move for the current calibration position
 */
router.post('/submit-move', [
  authenticateToken,
  body('move').notEmpty().withMessage('Move is required'),
  body('timeSpent').isInt({ min: 0 }).withMessage('Time spent must be a positive integer')
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
    const { move, timeSpent } = req.body;

    // Get current calibration
    const calibration = await prisma.userCalibration.findUnique({
      where: { userId }
    });

    if (!calibration || calibration.completedAt) {
      return res.status(400).json({ error: 'No active calibration found' });
    }

    const currentPositionData = CALIBRATION_POSITIONS.find(p => p.position === calibration.position);
    if (!currentPositionData) {
      return res.status(500).json({ error: 'Invalid calibration position' });
    }

    // Check if move is correct
    const isCorrect = move.toLowerCase() === currentPositionData.correctMove.toLowerCase();
    
    // Calculate preliminary rating estimate
    let ratingAdjustment = 0;
    if (isCorrect) {
      // Bonus for correct answer, more for harder positions, less for slow answers
      const basePoints = currentPositionData.difficulty * 50;
      const timeBonus = Math.max(0, currentPositionData.timeLimit - timeSpent) * 2;
      ratingAdjustment = basePoints + timeBonus;
    } else {
      // Penalty for wrong answer
      ratingAdjustment = -currentPositionData.difficulty * 30;
    }

    // Update calibration record
    await prisma.userCalibration.update({
      where: { userId },
      data: {
        userMove: move,
        timeSpent,
        isCorrect,
        ratingEstimate: calibration.ratingEstimate ? calibration.ratingEstimate + ratingAdjustment : 800 + ratingAdjustment
      }
    });

    // Log analytics event
    await prisma.analyticsEvent.create({
      data: {
        userId,
        eventType: 'calibration_move',
        eventData: {
          position: calibration.position,
          move,
          isCorrect,
          timeSpent,
          theme: currentPositionData.theme
        }
      }
    });

    // Check if this was the last position
    if (calibration.position >= CALIBRATION_POSITIONS.length) {
      return await completeCalibration(userId, res);
    }

    // Move to next position
    const nextPositionNum = calibration.position + 1;
    const nextPosition = CALIBRATION_POSITIONS[nextPositionNum - 1];

    await prisma.userCalibration.update({
      where: { userId },
      data: {
        position: nextPositionNum,
        fen: nextPosition.fen,
        correctMove: nextPosition.correctMove
      }
    });

    res.json({
      result: {
        isCorrect,
        correctMove: currentPositionData.correctMove,
        explanation: `This was a ${currentPositionData.theme} tactic. ${isCorrect ? 'Well done!' : 'Better luck next time!'}`
      },
      next: nextPositionNum <= CALIBRATION_POSITIONS.length ? {
        position: nextPositionNum,
        fen: nextPosition.fen,
        theme: nextPosition.theme,
        difficulty: nextPosition.difficulty,
        timeLimit: nextPosition.timeLimit,
        description: nextPosition.description,
        progress: nextPositionNum
      } : null,
      totalPositions: CALIBRATION_POSITIONS.length
    });

  } catch (error) {
    console.error('Error submitting calibration move:', error);
    res.status(500).json({ error: 'Failed to submit move' });
  }
});

/**
 * GET /api/calibration/result
 * Get calibration results
 */
router.get('/result', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user.userId;

    const calibration = await prisma.userCalibration.findUnique({
      where: { userId }
    });

    if (!calibration || !calibration.completedAt) {
      return res.status(400).json({ error: 'Calibration not completed yet' });
    }

    res.json({
      tacticsRating: calibration.tacticsRating,
      weakMotifs: calibration.weakMotifs,
      completedAt: calibration.completedAt,
      summary: generateCalibrationSummary(calibration)
    });

  } catch (error) {
    console.error('Error fetching calibration result:', error);
    res.status(500).json({ error: 'Failed to fetch calibration result' });
  }
});

// Helper function to complete calibration
async function completeCalibration(userId: string, res: Response) {
  try {
    const calibration = await prisma.userCalibration.findUnique({
      where: { userId }
    });

    if (!calibration) {
      return res.status(500).json({ error: 'Calibration not found' });
    }

    // Calculate final tactics rating and identify weak motifs
    const { tacticsRating, weakMotifs } = await calculateFinalRating(userId);

    // Update calibration with final results
    const completedCalibration = await prisma.userCalibration.update({
      where: { userId },
      data: {
        tacticsRating,
        weakMotifs,
        completedAt: new Date()
      }
    });

    // Update user stats with initial rating
    await prisma.userStats.upsert({
      where: { userId },
      update: {
        rating: tacticsRating,
        lastActivity: new Date()
      },
      create: {
        userId,
        rating: tacticsRating,
        totalXP: 0,
        currentLevel: 1,
        lastActivity: new Date()
      }
    });

    // Log completion event
    await prisma.analyticsEvent.create({
      data: {
        userId,
        eventType: 'calibration_complete',
        eventData: {
          tacticsRating,
          weakMotifs,
          calibrationId: completedCalibration.id
        }
      }
    });

    res.json({
      status: 'completed',
      tacticsRating,
      weakMotifs,
      completedAt: completedCalibration.completedAt,
      summary: generateCalibrationSummary(completedCalibration)
    });

  } catch (error) {
    console.error('Error completing calibration:', error);
    res.status(500).json({ error: 'Failed to complete calibration' });
  }
}

// Helper function to calculate final rating based on all attempts
async function calculateFinalRating(userId: string) {
  // This is a simplified implementation
  // In production, you'd use a more sophisticated algorithm like Elo rating updates
  
  const calibration = await prisma.userCalibration.findUnique({
    where: { userId }
  });

  if (!calibration) {
    throw new Error('Calibration not found');
  }

  // Use the current rating estimate as base
  let tacticsRating = calibration.ratingEstimate || 800;
  
  // Clamp rating to reasonable bounds
  tacticsRating = Math.max(400, Math.min(2200, tacticsRating));

  // Identify weak motifs based on incorrect answers
  // This would need to track individual position results - simplified for now
  const weakMotifs = ['pin', 'fork']; // Placeholder - would be calculated from actual performance

  return { tacticsRating: Math.round(tacticsRating), weakMotifs };
}

// Helper function to generate calibration summary
function generateCalibrationSummary(calibration: any) {
  const rating = calibration.tacticsRating;
  let level = 'Beginner';
  let message = 'Keep practicing to improve your tactical vision!';

  if (rating >= 1500) {
    level = 'Advanced';
    message = 'Excellent tactical strength! You\'re ready for complex puzzles.';
  } else if (rating >= 1200) {
    level = 'Intermediate';
    message = 'Good tactical foundation! Focus on pattern recognition.';
  } else if (rating >= 800) {
    level = 'Beginner+';
    message = 'You understand the basics. Time to master fundamental tactics!';
  }

  return {
    level,
    message,
    rating,
    nextSteps: [
      'Practice daily tactical puzzles',
      'Focus on your weak motifs',
      'Play games against appropriate level bots'
    ]
  };
}

export default router;