/**
 * Commercial Chess Engine v1.0
 * License: MIT - Free for commercial use without restrictions
 * No external dependencies - Built from scratch for Chess Academy v5
 */

import { Chess, Square, Move } from 'chess.js';

// Piece values for evaluation
const PIECE_VALUES = {
  p: 100,   // pawn
  n: 320,   // knight
  b: 330,   // bishop
  r: 500,   // rook
  q: 900,   // queen
  k: 20000  // king
};

// Position tables for piece placement evaluation
const PAWN_TABLE = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
  5,  5, 10, 25, 25, 10,  5,  5,
  0,  0,  0, 20, 20,  0,  0,  0,
  5, -5,-10,  0,  0,-10, -5,  5,
  5, 10, 10,-20,-20, 10, 10,  5,
  0,  0,  0,  0,  0,  0,  0,  0
];

const KNIGHT_TABLE = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50
];

const BISHOP_TABLE = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20
];

const ROOK_TABLE = [
  0,  0,  0,  0,  0,  0,  0,  0,
  5, 10, 10, 10, 10, 10, 10,  5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  0,  0,  0,  5,  5,  0,  0,  0
];

const QUEEN_TABLE = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
  -5,  0,  5,  5,  5,  5,  0, -5,
  0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20
];

const KING_MG_TABLE = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-30,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
  20, 20,  0,  0,  0,  0, 20, 20,
  20, 30, 10,  0,  0, 10, 30, 20
];

interface EvaluationResult {
  score: number;
  bestMove?: string;
}

export class CommercialChessEngine {
  private transpositionTable: Map<string, { score: number; depth: number; bestMove?: string }> = new Map();
  private killerMoves: string[][] = [];
  private historyTable: Map<string, number> = new Map();

  constructor() {
    // Initialize killer moves table
    for (let i = 0; i < 64; i++) {
      this.killerMoves[i] = [];
    }
  }

  /**
   * Get the best move for the current position
   */
  async getBestMove(fen: string, level: number, timeLimit: number = 3000): Promise<string> {
    const game = new Chess(fen);
    const moves = game.moves();

    if (moves.length === 0) return '';

    // Adjust search depth based on level (1-30)
    const depth = Math.min(Math.max(1, Math.floor(level / 5) + 1), 6);

    // Add some randomness for lower levels
    const randomness = Math.max(0, (15 - level) * 0.1);

    const startTime = Date.now();
    let bestMove = moves[0];
    let bestScore = -Infinity;

    // Iterative deepening
    for (let d = 1; d <= depth && Date.now() - startTime < timeLimit; d++) {
      const result = this.minimax(game, d, -Infinity, Infinity, true);
      if (result.bestMove) {
        bestMove = result.bestMove;
        bestScore = result.score;
      }
    }

    // Add randomness for beginner levels
    if (level <= 10 && Math.random() < randomness) {
      const randomMoves = moves.filter(move => {
        game.move(move);
        const isLegal = !game.isCheck() || Math.random() < 0.7;
        game.undo();
        return isLegal;
      });
      if (randomMoves.length > 0) {
        bestMove = randomMoves[Math.floor(Math.random() * randomMoves.length)];
      }
    }

    return bestMove;
  }

  /**
   * Evaluate the current position
   */
  async evaluatePosition(fen: string): Promise<number> {
    const game = new Chess(fen);
    return this.evaluate(game);
  }

  /**
   * Minimax algorithm with alpha-beta pruning
   */
  private minimax(game: Chess, depth: number, alpha: number, beta: number, maximizing: boolean): EvaluationResult {
    const positionKey = game.fen();

    // Check transposition table
    const stored = this.transpositionTable.get(positionKey);
    if (stored && stored.depth >= depth) {
      return { score: stored.score, bestMove: stored.bestMove };
    }

    if (depth === 0 || game.isGameOver()) {
      const score = this.evaluate(game);
      return { score };
    }

    const moves = this.orderMoves(game, game.moves());
    let bestMove: string | undefined;

    if (maximizing) {
      let maxScore = -Infinity;
      for (const move of moves) {
        game.move(move);
        const result = this.minimax(game, depth - 1, alpha, beta, false);
        game.undo();

        if (result.score > maxScore) {
          maxScore = result.score;
          bestMove = move;
        }

        alpha = Math.max(alpha, result.score);
        if (beta <= alpha) break; // Beta cutoff
      }

      // Store in transposition table
      this.transpositionTable.set(positionKey, { score: maxScore, depth, bestMove });
      return { score: maxScore, bestMove };
    } else {
      let minScore = Infinity;
      for (const move of moves) {
        game.move(move);
        const result = this.minimax(game, depth - 1, alpha, beta, true);
        game.undo();

        if (result.score < minScore) {
          minScore = result.score;
          bestMove = move;
        }

        beta = Math.min(beta, result.score);
        if (beta <= alpha) break; // Alpha cutoff
      }

      // Store in transposition table
      this.transpositionTable.set(positionKey, { score: minScore, depth, bestMove });
      return { score: minScore, bestMove };
    }
  }

  /**
   * Order moves for better alpha-beta pruning
   */
  private orderMoves(game: Chess, moves: string[]): string[] {
    return moves.sort((a, b) => {
      const scoreA = this.scoreMoveOrdering(game, a);
      const scoreB = this.scoreMoveOrdering(game, b);
      return scoreB - scoreA; // Higher scores first
    });
  }

  /**
   * Score move for move ordering
   */
  private scoreMoveOrdering(game: Chess, move: string): number {
    let score = 0;

    game.move(move);
    const moveObj = game.history({ verbose: true }).pop();
    game.undo();

    if (!moveObj) return 0;

    // Captures
    if (moveObj.captured) {
      score += PIECE_VALUES[moveObj.captured as keyof typeof PIECE_VALUES] -
               PIECE_VALUES[moveObj.piece as keyof typeof PIECE_VALUES];
    }

    // Promotions
    if (moveObj.promotion) {
      score += PIECE_VALUES[moveObj.promotion as keyof typeof PIECE_VALUES];
    }

    // Checks
    if (moveObj.san.includes('+')) {
      score += 50;
    }

    // Killer moves
    if (this.killerMoves[0]?.includes(move)) {
      score += 100;
    }

    // History heuristic
    const historyScore = this.historyTable.get(move) || 0;
    score += historyScore;

    return score;
  }

  /**
   * Evaluate the current position
   */
  private evaluate(game: Chess): number {
    if (game.isCheckmate()) {
      return game.turn() === 'w' ? -20000 : 20000;
    }

    if (game.isDraw() || game.isStalemate()) {
      return 0;
    }

    let score = 0;
    const board = game.board();

    // Material and positional evaluation
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const piece = board[rank][file];
        if (piece) {
          const isWhite = piece.color === 'w';
          const pieceValue = PIECE_VALUES[piece.type as keyof typeof PIECE_VALUES];
          const positionValue = this.getPositionValue(piece.type, rank, file, isWhite);

          const pieceScore = pieceValue + positionValue;
          score += isWhite ? pieceScore : -pieceScore;
        }
      }
    }

    // Mobility bonus
    const whiteMoves = game.turn() === 'w' ? game.moves().length : 0;
    game.load(game.fen().replace(/\s(w|b)\s/, game.turn() === 'w' ? ' b ' : ' w '));
    const blackMoves = game.turn() === 'b' ? game.moves().length : 0;

    score += (whiteMoves - blackMoves) * 10;

    // King safety
    score += this.evaluateKingSafety(game, 'w') - this.evaluateKingSafety(game, 'b');

    return game.turn() === 'w' ? score : -score;
  }

  /**
   * Get positional value for a piece
   */
  private getPositionValue(pieceType: string, rank: number, file: number, isWhite: boolean): number {
    const index = isWhite ? rank * 8 + file : (7 - rank) * 8 + file;

    switch (pieceType) {
      case 'p': return PAWN_TABLE[index];
      case 'n': return KNIGHT_TABLE[index];
      case 'b': return BISHOP_TABLE[index];
      case 'r': return ROOK_TABLE[index];
      case 'q': return QUEEN_TABLE[index];
      case 'k': return KING_MG_TABLE[index];
      default: return 0;
    }
  }

  /**
   * Evaluate king safety
   */
  private evaluateKingSafety(game: Chess, color: 'w' | 'b'): number {
    // Simplified king safety evaluation
    const kingSquare = this.findKing(game, color);
    if (!kingSquare) return 0;

    let safety = 0;

    // Penalize exposed king
    const kingFile = kingSquare.charCodeAt(0) - 97; // a=0, b=1, etc.
    const kingRank = parseInt(kingSquare[1]) - 1;

    // Check pawn shield
    const direction = color === 'w' ? 1 : -1;
    for (let file = kingFile - 1; file <= kingFile + 1; file++) {
      if (file >= 0 && file < 8) {
        const pawnSquare = String.fromCharCode(97 + file) + (kingRank + direction + 1);
        const piece = game.get(pawnSquare as Square);
        if (piece && piece.type === 'p' && piece.color === color) {
          safety += 30;
        }
      }
    }

    return safety;
  }

  /**
   * Find king position
   */
  private findKing(game: Chess, color: 'w' | 'b'): string | null {
    const board = game.board();
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const piece = board[rank][file];
        if (piece && piece.type === 'k' && piece.color === color) {
          return String.fromCharCode(97 + file) + (8 - rank);
        }
      }
    }
    return null;
  }

  /**
   * Clear caches for memory management
   */
  public clearCaches(): void {
    this.transpositionTable.clear();
    this.historyTable.clear();
    this.killerMoves = this.killerMoves.map(() => []);
  }

  /**
   * Get engine info
   */
  public getEngineInfo(): { name: string; version: string; author: string; license: string } {
    return {
      name: 'Commercial Chess Engine',
      version: '1.0.0',
      author: 'Chess Academy v5',
      license: 'MIT - Free for commercial use'
    };
  }
}

// Export singleton instance
export const commercialChessEngine = new CommercialChessEngine();