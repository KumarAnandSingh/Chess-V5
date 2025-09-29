import { useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import { getLevelConfig, isBossLevel } from '../config/levelConfig';

// Types for performance tracking
export interface MoveAnalysis {
  move: string;
  evaluationBefore: number;
  evaluationAfter: number;
  centipawnLoss: number;
  classification: 'brilliant' | 'excellent' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';
  timeSpent: number;
}

export interface GamePerformanceData {
  userId: string;
  levelId: number;
  result: 'win' | 'draw' | 'loss' | 'aborted';
  stars: number;
  PI: number;
  yourMoves: number;
  parMoves: number;
  avgSecPerMove: number;
  I: number;
  M: number;
  B: number;
  hintsUsed: number;
  undosUsed: number;
  pgn: string;
  moveTimesMs: number[];
  completedAt: string;
  // Legacy fields for compatibility
  gameId?: string;
  guestId?: string;
  startTime?: number;
  endTime?: number;
  totalTime?: number;
  averageTimePerMove?: number;
  moves?: MoveAnalysis[];
  performanceIndex?: number;
  starRating?: 0 | 1 | 2 | 3;
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  inaccuracies?: number;
  mistakes?: number;
  blunders?: number;
}

export interface PerformanceStats {
  totalGames: number;
  wins: number;
  draws: number;
  losses: number;
  averagePI: number;
  bestPI: number;
  totalStars: number;
  averageStars: number;
  bestGame: GamePerformanceData | null;
  recentGames: GamePerformanceData[];
}

const STORAGE_KEYS = {
  GUEST_ID: 'chess_guest_id',
  GAME_HISTORY: 'chess_game_history',
  CURRENT_GAME: 'chess_current_game'
};

// Generate unique guest ID
const generateGuestId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'guest_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

// Utility function for clamping values
const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

// Performance Index calculation - exact specification
const calculatePerformanceIndex = (input: {
  result: 'win' | 'draw' | 'loss' | 'aborted';
  yourMoves: number;
  parMoves: number;
  avgSecPerMove: number;
  I: number;
  M: number;
  B: number;
  hintsUsed: number;
  undosUsed: number;
}): number => {
  const { result, yourMoves, parMoves, avgSecPerMove, I, M, B, hintsUsed, undosUsed } = input;

  // If aborted, return 0
  if (result === 'aborted') return 0;

  const resultScore = result === 'win' ? 100 : result === 'draw' ? 60 : 0;
  const qualityScore = Math.max(0, 100 - (B * 25 + M * 10 + I * 5));

  const ratio = parMoves / Math.max(yourMoves, 1);
  const efficiencyScore = clamp(Math.round(100 * Math.pow(ratio, 0.5)), 30, 100);

  let timeScore = 30;
  if (avgSecPerMove <= 8) {
    timeScore = 100;
  } else if (avgSecPerMove <= 20) {
    // Linear interpolation: 100 at 8s, 50 at 20s
    timeScore = Math.round(100 - ((avgSecPerMove - 8) / 12) * 50);
  } else {
    // For >20s: slide 50→30 with proper scaling
    const extraTime = avgSecPerMove - 20;
    const scaleFactor = Math.min(extraTime / 30, 1); // Scale over 30s range
    timeScore = Math.round(50 - (scaleFactor * 20));
  }

  const penalty = hintsUsed * 15 + undosUsed * 10;

  const PI = clamp(
    Math.round(0.5 * resultScore + 0.2 * qualityScore + 0.2 * efficiencyScore + 0.1 * timeScore - penalty),
    0,
    100
  );

  return PI;
};

// Star rating calculation with aid caps - exact specification
const starsFromPI = (
  PI: number,
  result: 'win' | 'draw' | 'loss' | 'aborted',
  hintsUsed: number,
  undosUsed: number,
  isBoss: boolean,
  allowAids: boolean = true
): number => {
  // If aborted, return 0
  if (result === 'aborted') return 0;

  let cap = 3;

  if (allowAids && (hintsUsed > 0 || undosUsed > 0)) {
    cap = Math.min(cap, isBoss ? 1 : 2);
  }

  if (result === 'win' && PI >= 85 && hintsUsed === 0) {
    return Math.min(3, cap);
  }
  if (result === 'win' && PI >= 65) {
    return Math.min(2, cap);
  }
  if ((result === 'win' || result === 'draw') && PI >= 50) {
    return Math.min(1, cap);
  }

  return 0;
};

export const usePerformanceTracking = () => {
  const [guestId, setGuestId] = useState<string>('');
  const [currentGame, setCurrentGame] = useState<Partial<GamePerformanceData> | null>(null);
  const [gameHistory, setGameHistory] = useState<GamePerformanceData[]>([]);
  const [stats, setStats] = useState<PerformanceStats | null>(null);

  // Initialize guest ID and load data
  useEffect(() => {
    const storedGuestId = sessionStorage.getItem(STORAGE_KEYS.GUEST_ID);
    if (storedGuestId) {
      setGuestId(storedGuestId);
    } else {
      const newGuestId = generateGuestId();
      setGuestId(newGuestId);
      sessionStorage.setItem(STORAGE_KEYS.GUEST_ID, newGuestId);
    }

    // Load game history
    const storedHistory = sessionStorage.getItem(STORAGE_KEYS.GAME_HISTORY);
    if (storedHistory) {
      try {
        const history = JSON.parse(storedHistory);
        setGameHistory(history);
        calculateStats(history);
      } catch (error) {
        console.error('Error loading game history:', error);
      }
    }

    // Load current game
    const storedCurrentGame = sessionStorage.getItem(STORAGE_KEYS.CURRENT_GAME);
    if (storedCurrentGame) {
      try {
        setCurrentGame(JSON.parse(storedCurrentGame));
      } catch (error) {
        console.error('Error loading current game:', error);
      }
    }
  }, []);

  // Calculate performance stats
  const calculateStats = useCallback((history: GamePerformanceData[]) => {
    if (history.length === 0) {
      setStats({
        totalGames: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        averagePI: 0,
        bestPI: 0,
        totalStars: 0,
        averageStars: 0,
        bestGame: null,
        recentGames: []
      });
      return;
    }

    const wins = history.filter(g => g.result === 'win').length;
    const draws = history.filter(g => g.result === 'draw').length;
    const losses = history.filter(g => g.result === 'loss').length;

    const totalPI = history.reduce((sum, game) => sum + game.performanceIndex, 0);
    const totalStars = history.reduce((sum, game) => sum + game.starRating, 0);
    const bestGame = history.reduce((best, game) =>
      game.performanceIndex > (best?.performanceIndex || 0) ? game : best, history[0]);

    const newStats: PerformanceStats = {
      totalGames: history.length,
      wins,
      draws,
      losses,
      averagePI: Math.round(totalPI / history.length),
      bestPI: Math.max(...history.map(g => g.performanceIndex)),
      totalStars,
      averageStars: Math.round((totalStars / history.length) * 10) / 10,
      bestGame,
      recentGames: history.slice(-5).reverse()
    };

    setStats(newStats);
  }, []);

  // Start new game with level ID
  const startGame = useCallback((levelId: number, difficulty?: 'easy' | 'medium' | 'hard' | 'expert') => {
    const levelConfig = getLevelConfig(levelId);
    const gameData: Partial<GamePerformanceData> = {
      userId: guestId,
      levelId,
      result: 'loss', // Will be updated when game ends
      yourMoves: 0,
      parMoves: levelConfig.parMoves,
      hintsUsed: 0,
      undosUsed: 0,
      I: 0,
      M: 0,
      B: 0,
      moveTimesMs: [],
      // Legacy compatibility
      gameId: generateGuestId(),
      guestId,
      startTime: Date.now(),
      difficulty: difficulty || 'medium',
      playerMoves: 0,
      moves: [],
      inaccuracies: 0,
      mistakes: 0,
      blunders: 0
    };

    setCurrentGame(gameData);
    sessionStorage.setItem(STORAGE_KEYS.CURRENT_GAME, JSON.stringify(gameData));

    return gameData.gameId!;
  }, [guestId]);

  // Record move analysis with exact thresholds
  const recordMove = useCallback(async (
    move: string,
    evaluationBefore: number,
    evaluationAfter: number,
    timeSpent: number
  ) => {
    if (!currentGame) return;

    // Get level config for thresholds
    const levelConfig = getLevelConfig(currentGame.levelId || 1);
    const { I: inaccuracyThreshold, M: mistakeThreshold, B: blunderThreshold } = levelConfig.analysis.cpThresholds;

    const centipawnLoss = Math.abs(evaluationAfter - evaluationBefore);
    let classification: MoveAnalysis['classification'] = 'good';

    // Use exact thresholds: I≥40, M≥80, B≥150
    if (centipawnLoss >= blunderThreshold) {
      classification = 'blunder';
    } else if (centipawnLoss >= mistakeThreshold) {
      classification = 'mistake';
    } else if (centipawnLoss >= inaccuracyThreshold) {
      classification = 'inaccuracy';
    } else if (centipawnLoss <= 10 && evaluationAfter > evaluationBefore + 50) {
      classification = 'excellent';
    } else if (centipawnLoss <= 5 && evaluationAfter > evaluationBefore + 100) {
      classification = 'brilliant';
    }

    const moveAnalysis: MoveAnalysis = {
      move,
      evaluationBefore,
      evaluationAfter,
      centipawnLoss,
      classification,
      timeSpent
    };

    const updatedGame = {
      ...currentGame,
      yourMoves: (currentGame.yourMoves || 0) + 1,
      moveTimesMs: [...(currentGame.moveTimesMs || []), Math.round(timeSpent * 1000)],
      I: (currentGame.I || 0) + (classification === 'inaccuracy' ? 1 : 0),
      M: (currentGame.M || 0) + (classification === 'mistake' ? 1 : 0),
      B: (currentGame.B || 0) + (classification === 'blunder' ? 1 : 0),
      // Legacy compatibility
      playerMoves: (currentGame.playerMoves || 0) + 1,
      moves: [...(currentGame.moves || []), moveAnalysis],
      inaccuracies: (currentGame.inaccuracies || 0) + (classification === 'inaccuracy' ? 1 : 0),
      mistakes: (currentGame.mistakes || 0) + (classification === 'mistake' ? 1 : 0),
      blunders: (currentGame.blunders || 0) + (classification === 'blunder' ? 1 : 0)
    };

    setCurrentGame(updatedGame);
    sessionStorage.setItem(STORAGE_KEYS.CURRENT_GAME, JSON.stringify(updatedGame));
  }, [currentGame]);

  // Record hint usage
  const recordHint = useCallback(() => {
    if (!currentGame) return;

    const updatedGame = {
      ...currentGame,
      hintsUsed: (currentGame.hintsUsed || 0) + 1
    };

    setCurrentGame(updatedGame);
    sessionStorage.setItem(STORAGE_KEYS.CURRENT_GAME, JSON.stringify(updatedGame));
  }, [currentGame]);

  // Record undo usage
  const recordUndo = useCallback(() => {
    if (!currentGame) return;

    const updatedGame = {
      ...currentGame,
      undosUsed: (currentGame.undosUsed || 0) + 1
    };

    setCurrentGame(updatedGame);
    sessionStorage.setItem(STORAGE_KEYS.CURRENT_GAME, JSON.stringify(updatedGame));
  }, [currentGame]);

  // End game and calculate final performance
  const endGame = useCallback((result: 'win' | 'draw' | 'loss' | 'aborted', pgn: string = '') => {
    if (!currentGame) return null;

    const endTime = Date.now();
    const totalTime = endTime - (currentGame.startTime || Date.now());
    const moveCount = currentGame.yourMoves || currentGame.playerMoves || 0;
    const avgSecPerMove = moveCount > 0 ? totalTime / (moveCount * 1000) : 0;

    const levelConfig = getLevelConfig(currentGame.levelId || 1);
    const isBoss = levelConfig.boss;

    // Calculate PI and stars using exact formulas
    const PI = calculatePerformanceIndex({
      result,
      yourMoves: moveCount,
      parMoves: currentGame.parMoves || 40,
      avgSecPerMove,
      I: currentGame.I || 0,
      M: currentGame.M || 0,
      B: currentGame.B || 0,
      hintsUsed: currentGame.hintsUsed || 0,
      undosUsed: currentGame.undosUsed || 0
    });

    const stars = starsFromPI(
      PI,
      result,
      currentGame.hintsUsed || 0,
      currentGame.undosUsed || 0,
      isBoss,
      levelConfig.allowAids
    );

    const finalGameData: GamePerformanceData = {
      userId: currentGame.userId || guestId,
      levelId: currentGame.levelId || 1,
      result,
      stars,
      PI,
      yourMoves: moveCount,
      parMoves: currentGame.parMoves || 40,
      avgSecPerMove,
      I: currentGame.I || 0,
      M: currentGame.M || 0,
      B: currentGame.B || 0,
      hintsUsed: currentGame.hintsUsed || 0,
      undosUsed: currentGame.undosUsed || 0,
      pgn,
      moveTimesMs: currentGame.moveTimesMs || [],
      completedAt: new Date().toISOString(),
      // Legacy compatibility
      gameId: currentGame.gameId!,
      guestId: currentGame.guestId || guestId,
      startTime: currentGame.startTime!,
      endTime,
      totalTime,
      averageTimePerMove: avgSecPerMove,
      moves: currentGame.moves || [],
      difficulty: currentGame.difficulty!,
      inaccuracies: currentGame.inaccuracies || 0,
      mistakes: currentGame.mistakes || 0,
      blunders: currentGame.blunders || 0,
      performanceIndex: PI,
      starRating: stars as 0 | 1 | 2 | 3
    };

    // Update history
    const newHistory = [...gameHistory, finalGameData];
    setGameHistory(newHistory);
    calculateStats(newHistory);

    // Save to storage
    sessionStorage.setItem(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(newHistory));
    sessionStorage.removeItem(STORAGE_KEYS.CURRENT_GAME);
    setCurrentGame(null);

    return finalGameData;
  }, [currentGame, gameHistory, calculateStats, guestId]);

  // Reset all data (for testing)
  const resetData = useCallback(() => {
    setGameHistory([]);
    setCurrentGame(null);
    setStats(null);
    sessionStorage.removeItem(STORAGE_KEYS.GAME_HISTORY);
    sessionStorage.removeItem(STORAGE_KEYS.CURRENT_GAME);
  }, []);

  // Get current level configuration
  const getCurrentLevelConfig = useCallback(() => {
    if (!currentGame || !currentGame.levelId) return null;
    return getLevelConfig(currentGame.levelId);
  }, [currentGame]);

  // Check if current level is boss level
  const isCurrentLevelBoss = useCallback(() => {
    if (!currentGame || !currentGame.levelId) return false;
    return isBossLevel(currentGame.levelId);
  }, [currentGame]);

  return {
    guestId,
    currentGame,
    gameHistory,
    stats,
    startGame,
    recordMove,
    recordHint,
    recordUndo,
    endGame,
    resetData,
    getCurrentLevelConfig,
    isCurrentLevelBoss,
    // Helper methods for components
    getLevelConfig,
    isBossLevel
  };
};

export default usePerformanceTracking;