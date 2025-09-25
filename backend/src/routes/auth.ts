import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import passport from '../config/passport';
import {
  register,
  login,
  logout,
  refreshToken,
  getProfile,
  forgotPassword,
  resetPassword,
  googleAuth,
  googleCallback
} from '../controllers/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

// Protected routes
router.post('/logout', authenticateToken, logout);
router.get('/profile', authenticateToken, getProfile);

export default router;