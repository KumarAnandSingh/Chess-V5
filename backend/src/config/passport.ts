import passport from 'passport';
import { Strategy as JWTStrategy, ExtractJwt, StrategyOptions, VerifiedCallback } from 'passport-jwt';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { AuthService } from '../services/auth';
import { db } from '../services/database';

interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  iat?: number;
  exp?: number;
}

// JWT Strategy for API authentication
passport.use(
  'jwt',
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    },
    async (payload: JWTPayload, done: VerifiedCallback) => {
      try {
        const user = await db.user.findUnique({
          where: { id: payload.userId },
          select: {
            id: true,
            email: true,
            username: true,
            displayName: true,
            avatar: true,
            provider: true,
          },
        });

        if (user) {
          return done(null, {
            userId: user.id,
            email: user.email,
            username: user.username,
            displayName: user.displayName,
            avatar: user.avatar,
            provider: user.provider,
          });
        }

        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Google OAuth Strategy
passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback',
    } as any,
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      try {
        const email = profile.emails?.[0]?.value;
        const displayName = profile.displayName;
        const avatar = profile.photos?.[0]?.value;
        const providerId = profile.id;

        if (!email) {
          return done(new Error('No email provided by Google'), null);
        }

        // Check if user exists with this Google account
        let user = await db.user.findFirst({
          where: {
            provider: 'google',
            providerId: providerId,
          },
          include: {
            preferences: true,
            userStats: true,
            learningPath: true,
          },
        });

        if (!user) {
          // Check if user exists with same email but different provider
          const existingUser = await db.user.findFirst({
            where: { email: email.toLowerCase() },
          });

          if (existingUser) {
            // Link Google account to existing user
            user = await db.user.update({
              where: { id: existingUser.id },
              data: {
                provider: 'google',
                providerId: providerId,
                avatar: avatar || existingUser.avatar,
                emailVerified: true,
              },
              include: {
                preferences: true,
                userStats: true,
                learningPath: true,
              },
            });
          } else {
            // Create new user with Google account
            const username = await generateUniqueUsername(
              profile.name?.givenName || displayName.split(' ')[0] || 'user'
            );

            user = await db.user.create({
              data: {
                email: email.toLowerCase(),
                username,
                displayName,
                provider: 'google',
                providerId: providerId,
                avatar,
                emailVerified: true,
                preferences: {
                  create: {},
                },
                userStats: {
                  create: {},
                },
                learningPath: {
                  create: {},
                },
                streakData: {
                  create: {},
                },
              },
              include: {
                preferences: true,
                userStats: true,
                learningPath: true,
              },
            });
          }
        }

        // Update last login
        await db.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return done(null, user);
      } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
      }
    }
  )
);

// Helper function to generate unique username
async function generateUniqueUsername(baseUsername: string): Promise<string> {
  const cleanUsername = baseUsername.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
  let username = cleanUsername;
  let counter = 1;

  while (true) {
    const existingUser = await db.user.findUnique({
      where: { username },
    });

    if (!existingUser) {
      return username;
    }

    username = `${cleanUsername}${counter}`;
    counter++;
  }
}

export default passport;