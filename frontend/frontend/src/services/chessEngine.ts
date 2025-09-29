/**
 * Chess Engine Service - Commercial Engine Integration for Chess Academy v5
 * 100% Commercial-friendly - No GPL dependencies
 * License: MIT - Free for commercial use
 */

import { commercialChessEngine } from './commercialChessEngine';
import { getLevelConfig, BOT_PERSONALITIES } from '../config/levelConfig';

interface EngineMove {
  move: string;
  evaluation: number;
  depth: number;
  time: number;
}

interface PositionAnalysis {
  bestMove: string;
  evaluation: number;
  principalVariation: string[];
  depth: number;
  keyMoments?: {
    move: string;
    evaluation: number;
    comment: string;
  }[];
}

interface BotLevel {
  level: number;
  name: string;
  depth: number;
  timeLimit: number; // milliseconds
  elo: number;
  personality: string;
  avatar: string;
  category: string;
}

class ChessEngine {
  private isReady: boolean = true; // Commercial engine is always ready

  constructor() {
    console.log('🎯 Initializing Commercial Chess Engine v1.0 - MIT Licensed');
  }

  async waitForReady(): Promise<void> {
    // Commercial engine is always ready - no async initialization needed
    return Promise.resolve();
  }

  /**
   * Get bot move for specified difficulty level (1-30)
   */
  async getBotMove(fen: string, level: number = 1): Promise<EngineMove> {
    if (level < 1 || level > 30) {
      throw new Error('Bot level must be between 1 and 30');
    }

    const config = getLevelConfig(level);
    const startTime = Date.now();

    try {
      const bestMove = await commercialChessEngine.getBestMove(
        fen,
        config.engineLevel,
        config.thinkingTime
      );

      const evaluation = await commercialChessEngine.evaluatePosition(fen);
      const endTime = Date.now();

      // Add personality-based move variation for lower levels
      let finalMove = bestMove;
      if (level <= 10 && Math.random() < (11 - level) * 0.05) {
        // Occasionally make a suboptimal move for realism
        const { Chess } = await import('chess.js');
        const game = new Chess(fen);
        const allMoves = game.moves();
        if (allMoves.length > 1) {
          const randomIndex = Math.floor(Math.random() * Math.min(3, allMoves.length));
          finalMove = allMoves[randomIndex];
        }
      }

      return {
        move: finalMove,
        evaluation: evaluation / 100, // Convert centipawns to pawns
        depth: config.analysis.depth,
        time: endTime - startTime
      };
    } catch (error) {
      console.error('Bot move generation error:', error);
      // Fallback to a random legal move
      const { Chess } = await import('chess.js');
      const game = new Chess(fen);
      const moves = game.moves();
      const randomMove = moves[Math.floor(Math.random() * moves.length)];

      return {
        move: randomMove,
        evaluation: 0,
        depth: 1,
        time: Date.now() - startTime
      };
    }
  }

  /**
   * Analyze position for coaching hints and key moments
   */
  async analyzePosition(fen: string, depth: number = 12): Promise<PositionAnalysis> {
    try {
      const bestMove = await commercialChessEngine.getBestMove(fen, 15, 3000);
      const evaluation = await commercialChessEngine.evaluatePosition(fen);

      // Generate principal variation (simplified)
      const { Chess } = await import('chess.js');
      const game = new Chess(fen);
      const principalVariation: string[] = [];

      try {
        game.move(bestMove);
        principalVariation.push(bestMove);

        // Get one more move for basic PV
        const nextMove = await commercialChessEngine.getBestMove(game.fen(), 10, 1000);
        if (nextMove) {
          principalVariation.push(nextMove);
        }
      } catch (err) {
        // If moves fail, just return what we have
      }

      return {
        bestMove,
        evaluation: evaluation / 100,
        principalVariation,
        depth
      };
    } catch (error) {
      console.error('Position analysis error:', error);
      throw error;
    }
  }

  /**
   * Generate post-game analysis with key moments
   */
  async generateGameAnalysis(pgn: string): Promise<PositionAnalysis[]> {
    try {
      // Simplified game analysis - analyze key positions
      const { Chess } = await import('chess.js');
      const game = new Chess();
      const moves = pgn.split(' ').filter(move => !move.includes('.') && move.trim() !== '');
      const analyses: PositionAnalysis[] = [];

      // Analyze every 5th move for performance
      for (let i = 0; i < moves.length; i += 5) {
        try {
          if (i < moves.length) {
            game.move(moves[i]);
            const analysis = await this.analyzePosition(game.fen(), 10);
            analyses.push(analysis);
          }
        } catch (err) {
          // Skip invalid moves
          continue;
        }
      }

      return analyses.slice(0, 3); // Return top 3 key moments
    } catch (error) {
      console.error('Game analysis error:', error);
      return [];
    }
  }

  /**
   * Get available bot levels (1-30)
   */
  getBotLevels(): BotLevel[] {
    const levels: BotLevel[] = [];

    for (let i = 1; i <= 30; i++) {
      const config = getLevelConfig(i);
      const personality = BOT_PERSONALITIES[i];

      levels.push({
        level: i,
        name: config.name,
        depth: config.analysis.depth,
        timeLimit: config.thinkingTime,
        elo: 400 + (i * 60), // Progressive ELO from 400 to 2200
        personality: personality.description,
        avatar: personality.avatar,
        category: config.category
      });
    }

    return levels;
  }

  /**
   * Get bot configuration by level
   */
  getBotConfig(level: number): BotLevel | null {
    if (level < 1 || level > 30) return null;

    const config = getLevelConfig(level);
    const personality = BOT_PERSONALITIES[level];

    return {
      level,
      name: config.name,
      depth: config.analysis.depth,
      timeLimit: config.thinkingTime,
      elo: 400 + (level * 60),
      personality: personality.description,
      avatar: personality.avatar,
      category: config.category
    };
  }

  /**
   * Get bot personality message
   */
  getBotMessage(level: number, type: 'greeting' | 'goodMove' | 'mistake' | 'victory' | 'defeat' | 'hint'): string {
    const personality = BOT_PERSONALITIES[level] || BOT_PERSONALITIES[1];
    return personality.messages[type];
  }

  /**
   * Get bot theme colors
   */
  getBotTheme(level: number): { primary: string; secondary: string; accent: string } {
    const personality = BOT_PERSONALITIES[level] || BOT_PERSONALITIES[1];
    return personality.themeColors;
  }

  /**
   * Check if level is boss level
   */
  isBossLevel(level: number): boolean {
    const config = getLevelConfig(level);
    return config.boss;
  }

  /**
   * Get boss levels (5, 10, 15, 20, 25, 30)
   */
  getBossLevels(): number[] {
    return [5, 10, 15, 20, 25, 30];
  }

  /**
   * Calculate move quality based on centipawn loss
   */
  calculateMoveQuality(cpLoss: number, level: number): 'excellent' | 'good' | 'inaccuracy' | 'mistake' | 'blunder' {
    const config = getLevelConfig(level);
    const thresholds = config.analysis.cpThresholds;

    if (cpLoss < 10) return 'excellent';
    if (cpLoss < 25) return 'good';
    if (cpLoss < thresholds.I) return 'good';
    if (cpLoss < thresholds.M) return 'inaccuracy';
    if (cpLoss < thresholds.B) return 'mistake';
    return 'blunder';
  }

  /**
   * Get engine information
   */
  getEngineInfo(): { name: string; version: string; license: string; commercial: boolean } {
    return {
      name: 'Commercial Chess Engine',
      version: '1.0.0',
      license: 'MIT - Free for commercial use',
      commercial: true
    };
  }

  /**
   * Clean up engine resources
   */
  dispose(): void {
    // Commercial engine cleanup
    commercialChessEngine.clearCaches();
    console.log('🎯 Commercial Chess Engine disposed');
  }
}

// Singleton instance
let chessEngineInstance: ChessEngine | null = null;

export const getChessEngine = (): ChessEngine => {
  if (!chessEngineInstance) {
    chessEngineInstance = new ChessEngine();
  }
  return chessEngineInstance;
};

export type { EngineMove, PositionAnalysis, BotLevel };
export default ChessEngine;