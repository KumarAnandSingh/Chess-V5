import { Router } from 'express';

const router = Router();

// POST /api/games
router.post('/', (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Create game endpoint - to be implemented',
    data: null
  });
});

// GET /api/games/:id
router.get('/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Get game by ID endpoint - to be implemented',
    data: null
  });
});

// POST /api/games/:id/move
router.post('/:id/move', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Make move endpoint - to be implemented',
    data: null
  });
});

export default router;