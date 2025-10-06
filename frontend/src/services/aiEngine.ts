import { Chess } from 'chess.js';

type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

type EngineEvent = 'ready' | 'bestmove' | 'evaluation';

type Listener = (data?: any) => void;

interface EvaluationResult {
  score: number;
  mate?: number;
  bestMove?: string;
}

/**
 * Lightweight chess engine used for training bots.
 * Implements a small minimax search with heuristic evaluation
 * so we avoid depending on any GPL/AGPL chess engines.
 */
class TrainingEngine {
  private listeners: Map<EngineEvent, Set<Listener>> = new Map();
  private isReady = false;
  private defaultSkill = 10;

  constructor() {
    // Immediately mark the engine as ready on the next tick so
    // existing UI components receive the expected event.
    setTimeout(() => {
      this.isReady = true;
      this.emit('ready');
    }, 0);
  }

  get ready(): boolean {
    return this.isReady;
  }

  on(event: EngineEvent, listener: Listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  off(event: EngineEvent, listener: Listener) {
    this.listeners.get(event)?.delete(listener);
  }

  private emit(event: EngineEvent, payload?: any) {
    const callbacks = this.listeners.get(event);
    if (!callbacks) return;
    callbacks.forEach(listener => listener(payload));
  }

  setDifficulty(level: Difficulty) {
    const skillMap: Record<Difficulty, number> = {
      easy: 6,
      medium: 10,
      hard: 14,
      expert: 18,
    };
    this.defaultSkill = skillMap[level];
    return this.depthFromSkill(this.defaultSkill);
  }

  async getBestMove(fen: string, skillLevel?: number): Promise<string> {
    if (!this.isReady) {
      throw new Error('Engine not ready');
    }

    const skill = skillLevel ?? this.defaultSkill;
    const depth = this.depthFromSkill(skill);
    const move = this.searchBestMove(fen, depth, skill);

    // Mimic thinking delay so the UI feels natural.
    await new Promise(resolve => setTimeout(resolve, this.delayFromSkill(skill)));

    this.emit('bestmove', move);
    return move;
  }

  async getEvaluation(fen: string, depth: number = 2): Promise<EvaluationResult> {
    if (!this.isReady) {
      throw new Error('Engine not ready');
    }

    const game = new Chess(fen);
    const perspective = game.turn();
    const normalizedDepth = Math.max(1, Math.min(3, depth));
    const score = this.minimax(game, normalizedDepth, -Infinity, Infinity, perspective);

    const centipawnScore = Math.round(score * 100);
    const result: EvaluationResult = { score: centipawnScore };
    this.emit('evaluation', result);
    return result;
  }

  quit() {
    this.isReady = false;
    this.listeners.clear();
  }

  private delayFromSkill(skill: number) {
    if (skill <= 8) return 400;
    if (skill <= 12) return 600;
    if (skill <= 16) return 900;
    return 1100;
  }

  private depthFromSkill(skill: number) {
    if (skill <= 8) return 1;
    if (skill <= 12) return 2;
    return 3;
  }

  private searchBestMove(fen: string, depth: number, skill: number): string {
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

      const weightedScore = score + this.moveHeuristic(move, skill);
      if (weightedScore > bestScore) {
        bestScore = weightedScore;
        bestMove = move;
      }
    }

    return this.toUci(bestMove);
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
    } else {
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

  private moveHeuristic(move: any, skill: number) {
    if (skill <= 8) return 0;

    let score = 0;
    if (move.captured) score += 0.4;
    if (move.flags.includes('c')) score += 0.3;
    if (move.promotion) score += 0.6;
    if ((move.piece === 'n' || move.piece === 'b') && /[12]$/.test(move.from)) score += 0.2;
    return score;
  }

  private toUci(move: any): string {
    return `${move.from}${move.to}${move.promotion || ''}`;
  }
}

export const trainingEngine = new TrainingEngine();
export default TrainingEngine;
