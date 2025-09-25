import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './database';
import { CustomError } from '../middleware/errorHandler';

interface RegisterData {
  email: string;
  username: string;
  displayName: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface JWTPayload {
  userId: string;
  email: string;
  username: string;
}

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
  private static readonly JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  private static readonly BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12');

  // Generate JWT tokens
  static generateTokens(payload: JWTPayload) {
    const accessToken = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(payload, this.JWT_REFRESH_SECRET, {
      expiresIn: this.JWT_REFRESH_EXPIRES_IN,
    } as jwt.SignOptions);

    return { accessToken, refreshToken };
  }

  // Verify access token
  static verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.JWT_SECRET) as JWTPayload;
    } catch (error) {
      throw new CustomError('Invalid or expired token', 401);
    }
  }

  // Verify refresh token
  static verifyRefreshToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.JWT_REFRESH_SECRET) as JWTPayload;
    } catch (error) {
      throw new CustomError('Invalid or expired refresh token', 401);
    }
  }

  // Hash password
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.BCRYPT_ROUNDS);
  }

  // Compare password
  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Register new user
  static async register(data: RegisterData) {
    const { email, username, displayName, password } = data;

    // Check if user already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        throw new CustomError('Email already registered', 400);
      } else {
        throw new CustomError('Username already taken', 400);
      }
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create user with default preferences and stats
    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        displayName,
        passwordHash,
        preferences: {
          create: {}
        },
        userStats: {
          create: {}
        },
        learningPath: {
          create: {}
        },
        streakData: {
          create: {}
        }
      },
      include: {
        preferences: true,
        userStats: true,
        learningPath: true
      }
    });

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens({
      userId: user.id,
      email: user.email,
      username: user.username
    });

    // Create session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await db.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        refreshToken,
        expiresAt
      }
    });

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken
    };
  }

  // Login user
  static async login(data: LoginData) {
    const { email, password } = data;

    // Find user
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        preferences: true,
        userStats: true,
        learningPath: true
      }
    });

    if (!user) {
      throw new CustomError('Invalid email or password', 401);
    }

    // Check if user is OAuth user (no password)
    if (!user.passwordHash) {
      throw new CustomError('This account was created with social login. Please use the appropriate login method.', 400);
    }

    // Check password
    const isValidPassword = await this.comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      throw new CustomError('Invalid email or password', 401);
    }

    // Update last login
    await db.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens({
      userId: user.id,
      email: user.email,
      username: user.username
    });

    // Delete existing sessions and create new one
    await db.session.deleteMany({
      where: { userId: user.id }
    });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await db.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        refreshToken,
        expiresAt
      }
    });

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken
    };
  }

  // Logout user
  static async logout(userId: string) {
    await db.session.deleteMany({
      where: { userId }
    });
  }

  // Refresh token
  static async refreshToken(refreshToken: string) {
    // Verify refresh token
    const payload = this.verifyRefreshToken(refreshToken);

    // Find session
    const session = await db.session.findFirst({
      where: {
        userId: payload.userId,
        refreshToken,
        expiresAt: { gte: new Date() }
      }
    });

    if (!session) {
      throw new CustomError('Invalid refresh token', 401);
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(payload);

    // Update session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.session.update({
      where: { id: session.id },
      data: {
        token: accessToken,
        refreshToken: newRefreshToken,
        expiresAt,
        lastUsedAt: new Date()
      }
    });

    return {
      accessToken,
      refreshToken: newRefreshToken
    };
  }

  // Get user by ID
  static async getUserById(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        preferences: true,
        userStats: true,
        learningPath: true,
        streakData: true
      }
    });

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Create or update session (for OAuth)
  static async createOrUpdateSession(
    userId: string, 
    accessToken: string, 
    refreshToken: string, 
    expiresAt: Date
  ) {
    // Delete existing sessions for this user
    await db.session.deleteMany({
      where: { userId }
    });

    // Create new session
    return await db.session.create({
      data: {
        userId,
        token: accessToken,
        refreshToken,
        expiresAt,
        lastUsedAt: new Date()
      }
    });
  }

  // OAuth register/login method
  static async oauthLogin(userData: {
    email: string;
    username: string;
    displayName: string;
    provider: string;
    providerId: string;
    avatar?: string;
  }) {
    const { email, username, displayName, provider, providerId, avatar } = userData;

    // Check if user exists with this OAuth provider
    let user = await db.user.findFirst({
      where: {
        provider,
        providerId,
      },
      include: {
        preferences: true,
        userStats: true,
        learningPath: true,
        streakData: true
      }
    });

    if (!user) {
      // Check if user exists with same email but different provider
      const existingUser = await db.user.findFirst({
        where: { email: email.toLowerCase() }
      });

      if (existingUser) {
        // Link OAuth account to existing user
        user = await db.user.update({
          where: { id: existingUser.id },
          data: {
            provider,
            providerId,
            avatar: avatar || existingUser.avatar,
            emailVerified: true,
            lastLoginAt: new Date()
          },
          include: {
            preferences: true,
            userStats: true,
            learningPath: true,
            streakData: true
          }
        });
      } else {
        // Create new user
        user = await db.user.create({
          data: {
            email: email.toLowerCase(),
            username,
            displayName,
            provider,
            providerId,
            avatar,
            emailVerified: true,
            lastLoginAt: new Date(),
            preferences: {
              create: {}
            },
            userStats: {
              create: {}
            },
            learningPath: {
              create: {}
            },
            streakData: {
              create: {}
            }
          },
          include: {
            preferences: true,
            userStats: true,
            learningPath: true,
            streakData: true
          }
        });
      }
    } else {
      // Update existing OAuth user
      user = await db.user.update({
        where: { id: user.id },
        data: { 
          lastLoginAt: new Date(),
          avatar: avatar || user.avatar
        },
        include: {
          preferences: true,
          userStats: true,
          learningPath: true,
          streakData: true
        }
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens({
      userId: user.id,
      email: user.email,
      username: user.username
    });

    // Create session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await this.createOrUpdateSession(user.id, accessToken, refreshToken, expiresAt);

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken
    };
  }
}