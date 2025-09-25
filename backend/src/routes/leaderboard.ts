import { Router } from 'express';

const router = Router();

// GET /api/leaderboard/xp
router.get('/xp', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Get XP leaderboard endpoint - to be implemented',
    data: null
  });
});

// GET /api/leaderboard/streak
router.get('/streak', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Get streak leaderboard endpoint - to be implemented',
    data: null
  });
});

export default router;