import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import passport from './config/passport';

// Load environment variables
dotenv.config();

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { requestLogger } from './middleware/requestLogger';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import lessonRoutes from './routes/lessons';
import puzzleRoutes from './routes/puzzles';
import gameRoutes from './routes/games';
import achievementRoutes from './routes/achievements';
import leaderboardRoutes from './routes/leaderboard';
import dailyPlanRoutes from './routes/dailyPlan';
import calibrationRoutes from './routes/calibration';
import botGameRoutes from './routes/botGames';

const app = express();

// Trust proxy (required for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: (process.env.CORS_ORIGIN || process.env.FRONTEND_URL)?.split(',') || ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parsing middleware
app.use(cookieParser(process.env.COOKIE_SECRET));

// Initialize Passport
app.use(passport.initialize());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use(requestLogger);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Chess Academy API is running',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      lessons: '/api/lessons',
      puzzles: '/api/puzzles',
      games: '/api/games',
      achievements: '/api/achievements',
      leaderboard: '/api/leaderboard',
      dailyPlan: '/api/daily-plan',
      calibration: '/api/calibration',
      botGames: '/api/bot-games'
    }
  });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const DatabaseService = await import('./services/database');
    const dbHealth = await DatabaseService.default.healthCheck();
    
    res.status(200).json({
      status: dbHealth ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      services: {
        database: dbHealth ? 'connected' : 'disconnected',
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      error: 'Health check failed',
      services: {
        database: 'error',
      }
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/puzzles', puzzleRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/daily-plan', dailyPlanRoutes);
app.use('/api/calibration', calibrationRoutes);
app.use('/api/bot-games', botGameRoutes);

// Add missing /game route to prevent 500 errors
app.get('/game/:gameId', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Game endpoint - handled by WebSocket, check /multiplayer for lobby',
    gameId: req.params.gameId,
    data: null
  });
});

// 404 handler
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;