import { Router } from 'express';

const router = Router();

// GET /api/achievements
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Get achievements endpoint - to be implemented',
    data: null
  });
});

// GET /api/achievements/user
router.get('/user', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Get user achievements endpoint - to be implemented',
    data: null
  });
});

export default router;