import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { catchAsync } from '../middleware/errorHandler';
import { AuthService } from '../services/auth';

const router = Router();

// All user routes require authentication
router.use(authenticateToken);

// GET /api/users/profile
router.get('/profile', catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const user = await AuthService.getUserById(userId);

  res.json({
    success: true,
    message: 'Profile retrieved successfully',
    data: { user }
  });
}));

// PUT /api/users/profile
router.put('/profile', catchAsync(async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Update user profile endpoint - to be implemented',
    data: null
  });
}));

// GET /api/users/stats
router.get('/stats', catchAsync(async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Get user stats endpoint - to be implemented',
    data: null
  });
}));

// GET /api/users/progress
router.get('/progress', catchAsync(async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Get user progress endpoint - to be implemented',
    data: null
  });
}));

export default router;