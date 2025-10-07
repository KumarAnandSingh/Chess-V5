/**
 * Bot Game API Routes
 * Handles chess games against AI bots with 10 difficulty levels
 */

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { body, validationResult } from 'express-validator';
import { Chess } from 'chess.js';
import type { Request, Response } from 'express';

const router = Router();
const prisma = new PrismaClient();

// Bot difficulty levels - matching frontend configuration
const BOT_LEVELS = [
  { level: 1, name: "Pawn", depth: 1, timeLimit: 100, elo: 400, personality: "Makes random moves, very beginner-friendly" },
  { level: 2, name: "Knight", depth: 2, timeLimit: 200, elo: 600, personality: "Occasionally makes good moves but inconsistent" },
  { level: 3, name: "Bishop", depth: 3, timeLimit: 300, elo: 800, personality: "Understands basic tactics but makes mistakes" },
  { level: 4, name: "Rook", depth: 4, timeLimit: 500, elo: 1000, personality: "Solid player with good tactical awareness" },
  { level: 5, name: "Queen", depth: 5, timeLimit: 750, elo: 1200, personality: "Strong tactical player, rarely blunders" },
  { level: 6, name: "King", depth: 6, timeLimit: 1000, elo: 1400, personality: "Excellent tactical and positional understanding" },
  { level: 7, name: "Grandmaster", depth: 8, timeLimit: 1500, elo: 1600, personality: "Near-perfect play with deep calculation" },
  { level: 8, name: "World Champion", depth: 10, timeLimit: 2000, elo: 1800, personality: "Exceptional in all phases of the game" },
  { level: 9, name: "Immortal Tactician", depth: 12, timeLimit: 3000, elo: 2000, personality: "Computer-like precision with creative flair" },
  { level: 10, name: "Legendary Strategist", depth: 14, timeLimit: 5000, elo: 2200, personality: "Maximum strength for ultimate challenge" }
];

/**
 * GET /api/bot-games/levels
 * Get all available bot difficulty levels
 */
router.get('/levels', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      levels: BOT_LEVELS,
      message: "Available bot difficulty levels"
    }
  });
});

/**
 * POST /api/bot-games/start
 * Start a new bot game
 */
router.post('/start', [
  authenticateToken,
  body('botLevel').isInt({ min: 1, max: 10 }).withMessage('Bot level must be between 1 and 10'),
  body('userColor').isIn(['white', 'black']).withMessage('User color must be white or black')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'User not authenticated' 
      });
    }

    const userId = req.user.userId;
    const { botLevel, userColor } = req.body;

    // Get bot configuration
    const botConfig = BOT_LEVELS.find(b => b.level === botLevel);
    if (!botConfig) {
      return res.status(400).json({
        success: false,
        error: 'Invalid bot level'
      });
    }

    // Initialize chess game
    const chess = new Chess();
    const startingFen = chess.fen();

    // Create bot game record
    const botGame = await prisma.botGame.create({
      data: {
        userId,
        botLevel,
        botName: botConfig.name,
        userColor,
        startingFen: startingFen,
        currentFen: startingFen,
        gameStatus: 'playing',
        moves: [],
        movesCount: 0,
        analysisData: {
          botPersonality: botConfig.personality,
          depth: botConfig.depth,
          timeLimit: botConfig.timeLimit,
          elo: botConfig.elo
        }
      }
    });

    // Log analytics event
    await prisma.analyticsEvent.create({
      data: {
        userId,
        eventType: 'bot_game_start',
        eventData: {
          gameId: botGame.id,
          botLevel,
          botName: botConfig.name,
          userColor,
          botElo: botConfig.elo
        }
      }
    });

    res.json({
      success: true,
      data: {
        gameId: botGame.id,
        fen: startingFen,
        userColor,
        botLevel,
        botName: botConfig.name,
        botElo: botConfig.elo,
        botPersonality: botConfig.personality,
        gameStatus: 'playing',
        isUserTurn: userColor === 'white',
        message: `Game started against ${botConfig.name} (${botConfig.elo} ELO)`
      }
    });

  } catch (error) {
    console.error('Error starting bot game:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to start bot game' 
    });
  }
});

/**
 * POST /api/bot-games/:gameId/move
 * Make a move in a bot game
 */
router.post('/:gameId/move', [
  authenticateToken,
  body('move').notEmpty().withMessage('Move is required'),
  body('timeSpent').optional().isInt({ min: 0 }).withMessage('Time spent must be a positive integer')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'User not authenticated' 
      });
    }

    const userId = req.user.userId;
    const { gameId } = req.params;
    const { move, timeSpent } = req.body;

    // Get bot game
    const botGame = await prisma.botGame.findFirst({
      where: { 
        id: gameId,
        userId,
        gameStatus: 'playing'
      }
    });

    if (!botGame) {
      return res.status(404).json({
        success: false,
        error: 'Bot game not found or already completed'
      });
    }

    // Validate move using chess.js
    const chess = new Chess(botGame.currentFen);
    
    let validMove;
    try {
      validMove = chess.move(move);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid move'
      });
    }

    if (!validMove) {
      return res.status(400).json({
        success: false,
        error: 'Invalid move'
      });
    }

    const newFen = chess.fen();
    const isGameOver = chess.isGameOver();
    let gameResult = null;

    if (isGameOver) {
      if (chess.isCheckmate()) {
        gameResult = chess.turn() === 'w' ? 'loss' : 'win';
      } else if (chess.isDraw()) {
        gameResult = 'draw';
      }
    }

    // Update game with player move
    const moves = Array.isArray(botGame.moves) ? botGame.moves as string[] : [];
    moves.push(move);
    
    await prisma.botGame.update({
      where: { id: gameId },
      data: {
        currentFen: newFen,
        moves: moves,
        gameStatus: isGameOver ? 'completed' : 'playing',
        gameResult: gameResult,
        pgn: chess.pgn(),
        movesCount: chess.history().length,
        timeSpent: (botGame.timeSpent || 0) + (timeSpent || 0)
      }
    });

    // Log player move
    await prisma.analyticsEvent.create({
      data: {
        userId,
        eventType: 'bot_game_move',
        eventData: {
          gameId,
          move,
          fen: newFen,
          timeSpent: timeSpent || 0,
          moveNumber: chess.history().length,
          isUserMove: true
        }
      }
    });

    // If game is over, return final result
    if (isGameOver) {
      return res.json({
        success: true,
        data: {
          gameId,
          fen: newFen,
          move: validMove,
          isGameOver: true,
          gameResult: gameResult,
          pgn: chess.pgn(),
          message: getGameEndMessage(gameResult, botGame.userColor)
        }
      });
    }

    // Game continues - bot needs to make a move
    res.json({
      success: true,
      data: {
        gameId,
        fen: newFen,
        move: validMove,
        isGameOver: false,
        isUserTurn: false,
        waitingForBot: true,
        message: "Your move played. Bot is thinking..."
      }
    });

  } catch (error) {
    console.error('Error making move in bot game:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to make move' 
    });
  }
});

/**
 * POST /api/bot-games/:gameId/bot-move
 * Submit bot move (called by frontend after getting move from training engine)
 */
router.post('/:gameId/bot-move', [
  authenticateToken,
  body('move').notEmpty().withMessage('Bot move is required'),
  body('evaluation').optional().isNumeric().withMessage('Evaluation must be numeric'),
  body('depth').optional().isInt({ min: 1 }).withMessage('Depth must be positive integer')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'User not authenticated' 
      });
    }

    const userId = req.user.userId;
    const { gameId } = req.params;
    const { move, evaluation, depth } = req.body;

    // Get bot game
    const botGame = await prisma.botGame.findFirst({
      where: { 
        id: gameId,
        userId,
        gameStatus: 'playing'
      }
    });

    if (!botGame) {
      return res.status(404).json({
        success: false,
        error: 'Bot game not found or already completed'
      });
    }

    // Validate bot move
    const chess = new Chess(botGame.currentFen);
    
    let validMove;
    try {
      validMove = chess.move(move);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid bot move'
      });
    }

    const newFen = chess.fen();
    const isGameOver = chess.isGameOver();
    let gameResult = null;

    if (isGameOver) {
      if (chess.isCheckmate()) {
        gameResult = chess.turn() === 'w' ? 'win' : 'loss';
      } else if (chess.isDraw()) {
        gameResult = 'draw';
      }
    }

    // Update game with bot move
    const moves = Array.isArray(botGame.moves) ? botGame.moves as string[] : [];
    moves.push(move);
    
    await prisma.botGame.update({
      where: { id: gameId },
      data: {
        currentFen: newFen,
        moves: moves,
        gameStatus: isGameOver ? 'completed' : 'playing',
        gameResult: gameResult,
        pgn: chess.pgn(),
        movesCount: chess.history().length
      }
    });

    // Log bot move
    await prisma.analyticsEvent.create({
      data: {
        userId,
        eventType: 'bot_game_move',
        eventData: {
          gameId,
          move,
          fen: newFen,
          evaluation: evaluation || 0,
          depth: depth || 0,
          moveNumber: chess.history().length,
          isUserMove: false
        }
      }
    });

    // If game is over, log completion
    if (isGameOver) {
      await prisma.analyticsEvent.create({
        data: {
          userId,
          eventType: 'bot_game_complete',
          eventData: {
            gameId,
            gameResult: gameResult,
            movesCount: chess.history().length,
            botLevel: botGame.botLevel,
            userColor: botGame.userColor
          }
        }
      });
    }

    res.json({
      success: true,
      data: {
        gameId,
        fen: newFen,
        move: validMove,
        evaluation: evaluation || 0,
        isGameOver,
        gameResult: gameResult,
        isUserTurn: !isGameOver,
        pgn: chess.pgn(),
        message: isGameOver ? getGameEndMessage(gameResult, botGame.userColor) : "Bot played. Your turn!"
      }
    });

  } catch (error) {
    console.error('Error submitting bot move:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to submit bot move' 
    });
  }
});

/**
 * GET /api/bot-games/:gameId
 * Get bot game details
 */
router.get('/:gameId', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'User not authenticated' 
      });
    }

    const userId = req.user.userId;
    const { gameId } = req.params;

    const botGame = await prisma.botGame.findFirst({
      where: { 
        id: gameId,
        userId 
      }
    });

    if (!botGame) {
      return res.status(404).json({
        success: false,
        error: 'Bot game not found'
      });
    }

    // Get game statistics
    const chess = new Chess(botGame.currentFen);
    const isUserTurn = (botGame.userColor === 'white' && chess.turn() === 'w') ||
                         (botGame.userColor === 'black' && chess.turn() === 'b');

    // Extract bot ELO from analysisData if available
    const analysisData = botGame.analysisData as any;
    const botElo = analysisData?.elo || BOT_LEVELS.find(b => b.level === botGame.botLevel)?.elo || 800;

    res.json({
      success: true,
      data: {
        gameId: botGame.id,
        fen: botGame.currentFen,
        userColor: botGame.userColor,
        botLevel: botGame.botLevel,
        botName: botGame.botName,
        botElo: botElo,
        gameStatus: botGame.gameStatus,
        gameResult: botGame.gameResult,
        isUserTurn: isUserTurn && botGame.gameStatus === 'playing',
        pgn: botGame.pgn,
        movesCount: botGame.movesCount || 0,
        createdAt: botGame.createdAt,
        updatedAt: botGame.updatedAt
      }
    });

  } catch (error) {
    console.error('Error getting bot game:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get bot game' 
    });
  }
});

/**
 * GET /api/bot-games
 * Get user's bot game history
 */
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'User not authenticated' 
      });
    }

    const userId = req.user.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [games, totalCount] = await Promise.all([
      prisma.botGame.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          botLevel: true,
          botName: true,
          userColor: true,
          gameStatus: true,
          gameResult: true,
          movesCount: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.botGame.count({ where: { userId } })
    ]);

    // Calculate statistics
    const stats = {
      totalGames: totalCount,
      wins: games.filter(g => g.gameResult === 'win').length,
      losses: games.filter(g => g.gameResult === 'loss').length,
      draws: games.filter(g => g.gameResult === 'draw').length
    };

    res.json({
      success: true,
      data: {
        games,
        stats,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error getting bot games:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get bot games' 
    });
  }
});

/**
 * POST /api/bot-games/:gameId/resign
 * Resign from a bot game
 */
router.post('/:gameId/resign', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'User not authenticated' 
      });
    }

    const userId = req.user.userId;
    const { gameId } = req.params;

    const botGame = await prisma.botGame.findFirst({
      where: { 
        id: gameId,
        userId,
        gameStatus: 'playing'
      }
    });

    if (!botGame) {
      return res.status(404).json({
        success: false,
        error: 'Bot game not found or already completed'
      });
    }

    // Update game as resigned
    const gameResult = 'loss';
    
    await prisma.botGame.update({
      where: { id: gameId },
      data: {
        gameStatus: 'completed',
        gameResult
      }
    });

    // Log resignation
    await prisma.analyticsEvent.create({
      data: {
        userId,
        eventType: 'bot_game_resign',
        eventData: {
          gameId,
          gameResult,
          botLevel: botGame.botLevel,
          userColor: botGame.userColor
        }
      }
    });

    res.json({
      success: true,
      data: {
        gameId,
        gameResult,
        message: "Game resigned. Better luck next time!"
      }
    });

  } catch (error) {
    console.error('Error resigning bot game:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to resign game' 
    });
  }
});

// Helper function to generate game end messages
function getGameEndMessage(result: string | null, userColor: string): string {
  if (!result) return "Game in progress";
  
  if (result === 'draw') {
    return "Game ended in a draw!";
  }
  
  return result === 'win' ? "Congratulations! You won!" : "Bot wins! Good game!";
}

export default router;