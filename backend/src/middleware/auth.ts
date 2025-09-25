import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth';
import { CustomError } from './errorHandler';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface User {
      userId: string;
      email: string;
      username: string;
      displayName?: string;
      avatar?: string;
      provider?: string;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new CustomError('Access token required', 401);
    }

    // Demo mode: Accept mock-jwt-token for Phase 0 demo
    if (token === 'mock-jwt-token' && process.env.NODE_ENV === 'development') {
      req.user = {
        userId: 'demo-user-123',
        email: 'demo@chesslabs.com',
        username: 'demo_user',
        displayName: 'Demo User',
        avatar: undefined,
        provider: 'demo'
      };
      next();
      return;
    }

    // Verify token
    const payload = AuthService.verifyAccessToken(token);
    req.user = payload;

    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const payload = AuthService.verifyAccessToken(token);
        req.user = payload;
      } catch (error) {
        // Token is invalid, but we continue without user
        console.log('Optional auth failed:', error);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};