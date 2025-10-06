import { Chess } from 'chess.js';

export interface EngineMove {
  move: string;
  evaluation: number;
  depth: number;
  time: number;
}

export interface PositionAnalysis {
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

export interface BotLevel {
  level: number;
  name: string;
  depth: number;
  timeLimit: number;
  elo: number;
  personality: string;
}

const BOT_LEVELS: BotLevel[] = [
  { level: 1, name: 'Pawn', depth: 1, timeLimit: 100, elo: 400, personality: 'Makes random moves, very beginner-friendly' },
  { level: 2, name: 'Knight', depth: 2, timeLimit: 200, elo: 600, personality: 'Occasionally makes good moves but inconsistent' },
  { level: 3, name: 'Bishop', depth: 3, timeLimit: 300, elo: 800, personality: 'Understands basic tactics but makes mistakes' },
  { level: 4, name: 'Rook', depth: 4, timeLimit: 500, elo: 1000, personality: 'Solid player with good tactical awareness' },
  { level: 5, name: 'Queen', depth: 5, timeLimit: 750, elo: 1200, personality: 'Strong tactical player, rarely blunders' },
  { level: 6, name: 'King', depth: 6, timeLimit: 1000, elo: 1400, personality: 'Excellent tactical and positional understanding' },
  { level: 7, name: 'Grandmaster', depth: 8, timeLimit: 1500, elo: 1600, personality: 'Near-perfect play with deep calculation' },
  { level: 8, name: 'World Champion', depth: 10, timeLimit: 2000, elo: 1800, personality: 'Exceptional in all phases of the game' },
  { level: 9, name: 'Immortal Tactician', depth: 12, timeLimit: 3000, elo: 2000, personality: 'Computer-like precision with creative flair' },
  { level: 10, name: 'Legendary Strategist', depth: 14, timeLimit: 5000, elo: 2200, personality: 'Maximum strength for ultimate challenge' }
];

class ChessEngine {
  private isReady = false;
  private readyPromise: Promise<void>;

  constructor() {
    this.readyPromise = this.initialize();
  }

  private async initialize(): Promise<void> {
    this.isReady = true;
  }

  private async ensureReady(): Promise<void> {
    if (!this.isReady) {
      await this.readyPromise;
    }
  }

  getBotLevels(): BotLevel[] {
    return [...BOT_LEVELS];
  }

  getBotConfig(level: number): BotLevel | null {
    if (level < 1 || level > BOT_LEVELS.length) return null;
    return BOT_LEVELS[level - 1];
  }

  async getBotMove(fen: string, level: number = 5): Promise<EngineMove> {
    await this.ensureReady();

    if (level < 1 || level > BOT_LEVELS.length) {
      throw new Error('Bot level must be between 1 and 10');
    }

    const botConfig = BOT_LEVELS[level - 1];
    const depth = this.normalizeDepth(botConfig.depth);
    const start = Date.now();
    const move = this.searchBestMove(fen, depth);
    const time = Date.now() - start;
    const evaluation = this.evaluatePosition(fen, depth);

    return {
      move,
      evaluation,
      depth,
      time,
    };
  }

  async analyzePosition(fen: string, depth: number = 12): Promise<PositionAnalysis> {
    await this.ensureReady();

    const normalizedDepth = this.normalizeDepth(depth);
    const { bestMove, principalVariation, evaluation } = this.calculatePrincipalVariation(fen, normalizedDepth);

    return {
      bestMove,
      evaluation,
      principalVariation,
      depth: normalizedDepth,
      keyMoments: principalVariation.slice(0, 3).map((move, index) => ({
        move,
        evaluation: evaluation - index * 0.1,
        comment: index === 0
          ? 'Strong move that maintains the initiative'
          : index === 1
            ? 'Continues to build an advantage'
            : 'Keeps pressure on the opponent',
      })),
    };
  }

  async generateGameAnalysis(pgn: string): Promise<PositionAnalysis[]> {
    await this.ensureReady();
    // Placeholder implementation: return a simple plan derived from opening principles.
    return [
      {
        bestMove: 'e4',
        evaluation: 0.2,
        principalVariation: ['e4', 'e5', 'Nf3'],
        depth: 2,
        keyMoments: [
          { move: 'e4', evaluation: 0.2, comment: 'Controls the centre and opens lines for development' },
          { move: 'Nf3', evaluation: 0.3, comment: 'Develops with tempo towards the middle of the board' },
          { move: 'Bc4', evaluation: 0.35, comment: 'Targets the f7 square and prepares to castle' },
        ],
      },
    ];
  }

  dispose(): void {
    this.isReady = false;
  }

  private normalizeDepth(depth: number): number {
    if (depth <= 2) return 1;
    if (depth <= 6) return 2;
    if (depth <= 10) return 3;
    return 4;
  }

  private searchBestMove(fen: string, depth: number): string {
    const game = new Chess(fen);
    const perspective = game.turn();
    const moves = game.moves({ verbose: true });

    if (moves.length === 0) {
      return '0000';
    }

    let bestMove = moves[0];
    let bestScore = -Infinity;

    for (const move of moves) {
      game.move(move);
      const score = this.minimax(game, depth - 1, -Infinity, Infinity, perspective);
      game.undo();

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return this.toUci(bestMove);
  }

  private evaluatePosition(fen: string, depth: number): number {
    const game = new Chess(fen);
    const perspective = game.turn();
    const score = this.minimax(game, depth, -Infinity, Infinity, perspective);
    return Math.round(score * 100);
  }

  private calculatePrincipalVariation(fen: string, depth: number) {
    const variation: string[] = [];
    const game = new Chess(fen);
    const perspective = game.turn();

    for (let remaining = depth; remaining > 0; remaining--) {
      const moves = game.moves({ verbose: true });
      if (moves.length === 0) break;

      let bestMove = moves[0];
      let bestScore = -Infinity;

      for (const move of moves) {
        game.move(move);
        const score = this.minimax(game, remaining - 1, -Infinity, Infinity, perspective);
        game.undo();

        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }

      game.move(bestMove);
      variation.push(this.toUci(bestMove));
    }

    const evaluation = this.evaluateBoard(game, perspective);
    return { bestMove: variation[0] ?? '0000', principalVariation: variation, evaluation };
  }

  private minimax(game: Chess, depth: number, alpha: number, beta: number, perspective: 'w' | 'b'): number {
    if (depth === 0 || game.isGameOver()) {
      return this.evaluateBoard(game, perspective);
    }

    const moves = game.moves({ verbose: true });
    const isMaximizing = game.turn() === perspective;

    if (isMaximizing) {
      let value = -Infinity;
      for (const move of moves) {
        game.move(move);
        value = Math.max(value, this.minimax(game, depth - 1, alpha, beta, perspective));
        game.undo();
        alpha = Math.max(alpha, value);
        if (alpha >= beta) break;
      }
      return value;
    }

    let value = Infinity;
    for (const move of moves) {
      game.move(move);
      value = Math.min(value, this.minimax(game, depth - 1, alpha, beta, perspective));
      game.undo();
      beta = Math.min(beta, value);
      if (beta <= alpha) break;
    }
    return value;
  }

  private evaluateBoard(game: Chess, perspective: 'w' | 'b'): number {
    const pieceValues: Record<string, number> = {
      p: 1,
      n: 3,
      b: 3,
      r: 5,
      q: 9,
      k: 0,
    };

    let score = 0;
    const board = game.board();

    for (const row of board) {
      for (const piece of row) {
        if (!piece) continue;
        const value = pieceValues[piece.type];
        score += piece.color === perspective ? value : -value;
      }
    }

    if (game.inCheckmate()) {
      const losingColor = game.turn();
      if (losingColor === perspective) {
        score = -999;
      } else {
        score = 999;
      }
    }

    if (game.isDraw()) {
      score = 0;
    }

    return score;
  }

  private toUci(move: any): string {
    return `${move.from}${move.to}${move.promotion || ''}`;
  }
}

let chessEngineInstance: ChessEngine | null = null;

export const getChessEngine = (): ChessEngine => {
  if (!chessEngineInstance) {
    chessEngineInstance = new ChessEngine();
  }
  return chessEngineInstance;
};

export default ChessEngine;
