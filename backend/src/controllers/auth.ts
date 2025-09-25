import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import passport from '../config/passport';
import { AuthService } from '../services/auth';
import { CustomError, catchAsync } from '../middleware/errorHandler';

// Validation rules
export const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('username')
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-20 characters and contain only letters, numbers, and underscores'),
  body('displayName')
    .isLength({ min: 2, max: 50 })
    .withMessage('Display name must be 2-50 characters'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must be at least 8 characters with uppercase, lowercase, and number')
];

export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Check validation errors
const checkValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg).join(', ');
    throw new CustomError(errorMessages, 400);
  }
  next();
};

// Register controller
export const register = [
  ...registerValidation,
  checkValidationErrors,
  catchAsync(async (req: Request, res: Response) => {
    const { email, username, displayName, password } = req.body;

    const result = await AuthService.register({
      email,
      username,
      displayName,
      password
    });

    // Set HTTP-only cookie for refresh token
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: result.user,
        accessToken: result.accessToken
      }
    });
  })
];

// Login controller
export const login = [
  ...loginValidation,
  checkValidationErrors,
  catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await AuthService.login({ email, password });

    // Set HTTP-only cookie for refresh token
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        accessToken: result.accessToken
      }
    });
  })
];

// Logout controller
export const logout = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (userId) {
    await AuthService.logout(userId);
  }

  // Clear refresh token cookie
  res.clearCookie('refreshToken');

  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// Refresh token controller
export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new CustomError('Refresh token not provided', 401);
  }

  const result = await AuthService.refreshToken(refreshToken);

  // Set new refresh token cookie
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.json({
    success: true,
    message: 'Token refreshed successfully',
    data: {
      accessToken: result.accessToken
    }
  });
});

// Get current user profile
export const getProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new CustomError('User not authenticated', 401);
  }

  const user = await AuthService.getUserById(userId);

  res.json({
    success: true,
    message: 'Profile retrieved successfully',
    data: { user }
  });
});

// Forgot password (placeholder for now)
export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Password reset functionality will be implemented soon',
    data: null
  });
});

// Reset password (placeholder for now)
export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Password reset functionality will be implemented soon',
    data: null
  });
});

// Google OAuth initiation
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

// Google OAuth callback
export const googleCallback = [
  passport.authenticate('google', { session: false }),
  catchAsync(async (req: Request, res: Response) => {
    const user = req.user as any;

    if (!user) {
      // Redirect to frontend with error
      const frontendUrl = process.env.CORS_ORIGIN || 'http://localhost:5173';
      return res.redirect(`${frontendUrl}/auth/error?message=Authentication failed`);
    }

    // Generate JWT tokens for the OAuth user
    const { accessToken, refreshToken } = AuthService.generateTokens({
      userId: user.id,
      email: user.email,
      username: user.username
    });

    // Create or update session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await AuthService.createOrUpdateSession(user.id, accessToken, refreshToken, expiresAt);

    // Set HTTP-only cookie for refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Redirect to frontend with success
    const frontendUrl = process.env.CORS_ORIGIN || 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}/auth/success?token=${accessToken}`;
    
    res.redirect(redirectUrl);
  })
];