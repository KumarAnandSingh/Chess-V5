export interface LevelConfig {
  levelId: number;
  parMoves: number;
  boss: boolean;
  allowAids: boolean;
  bossStarCapWithAids: number;
  analysis: {
    depth: number;
    cpThresholds: { I: number, M: number, B: number };
  };
}

// Default level configuration
export const DEFAULT_LEVEL_CONFIG: Omit<LevelConfig, 'levelId' | 'parMoves'> = {
  boss: false,
  allowAids: true,
  bossStarCapWithAids: 1,
  analysis: {
    depth: 12,
    cpThresholds: { I: 40, M: 80, B: 150 }
  }
};

// Level configurations - extend this as needed
export const LEVEL_CONFIGS: Record<number, LevelConfig> = {
  1: { levelId: 1, parMoves: 30, boss: false, allowAids: true, bossStarCapWithAids: 1, analysis: { depth: 12, cpThresholds: { I: 40, M: 80, B: 150 } } },
  2: { levelId: 2, parMoves: 32, boss: false, allowAids: true, bossStarCapWithAids: 1, analysis: { depth: 12, cpThresholds: { I: 40, M: 80, B: 150 } } },
  3: { levelId: 3, parMoves: 35, boss: false, allowAids: true, bossStarCapWithAids: 1, analysis: { depth: 12, cpThresholds: { I: 40, M: 80, B: 150 } } },
  4: { levelId: 4, parMoves: 38, boss: false, allowAids: true, bossStarCapWithAids: 1, analysis: { depth: 12, cpThresholds: { I: 40, M: 80, B: 150 } } },
  5: { levelId: 5, parMoves: 40, boss: true, allowAids: true, bossStarCapWithAids: 1, analysis: { depth: 12, cpThresholds: { I: 40, M: 80, B: 150 } } }, // Boss level
  6: { levelId: 6, parMoves: 42, boss: false, allowAids: true, bossStarCapWithAids: 1, analysis: { depth: 12, cpThresholds: { I: 40, M: 80, B: 150 } } },
  7: { levelId: 7, parMoves: 44, boss: false, allowAids: true, bossStarCapWithAids: 1, analysis: { depth: 12, cpThresholds: { I: 40, M: 80, B: 150 } } },
  8: { levelId: 8, parMoves: 46, boss: false, allowAids: true, bossStarCapWithAids: 1, analysis: { depth: 12, cpThresholds: { I: 40, M: 80, B: 150 } } },
  9: { levelId: 9, parMoves: 48, boss: false, allowAids: true, bossStarCapWithAids: 1, analysis: { depth: 12, cpThresholds: { I: 40, M: 80, B: 150 } } },
  10: { levelId: 10, parMoves: 50, boss: true, allowAids: true, bossStarCapWithAids: 1, analysis: { depth: 12, cpThresholds: { I: 40, M: 80, B: 150 } } }, // Boss level
  11: { levelId: 11, parMoves: 48, boss: false, allowAids: true, bossStarCapWithAids: 1, analysis: { depth: 12, cpThresholds: { I: 40, M: 80, B: 150 } } },
  12: { levelId: 12, parMoves: 50, boss: false, allowAids: true, bossStarCapWithAids: 1, analysis: { depth: 12, cpThresholds: { I: 40, M: 80, B: 150 } } },
  13: { levelId: 13, parMoves: 52, boss: false, allowAids: true, bossStarCapWithAids: 1, analysis: { depth: 12, cpThresholds: { I: 40, M: 80, B: 150 } } },
  14: { levelId: 14, parMoves: 52, boss: false, allowAids: true, bossStarCapWithAids: 1, analysis: { depth: 12, cpThresholds: { I: 40, M: 80, B: 150 } } }, // Sanity check level
  15: { levelId: 15, parMoves: 55, boss: true, allowAids: true, bossStarCapWithAids: 1, analysis: { depth: 12, cpThresholds: { I: 40, M: 80, B: 150 } } }, // Boss level
};

/**
 * Get level configuration for a given level ID
 * Falls back to default configuration if level not found
 */
export const getLevelConfig = (levelId: number): LevelConfig => {
  return LEVEL_CONFIGS[levelId] || {
    levelId,
    parMoves: 40,
    ...DEFAULT_LEVEL_CONFIG
  };
};

/**
 * Check if a level is a boss level
 */
export const isBossLevel = (levelId: number): boolean => {
  const config = getLevelConfig(levelId);
  return config.boss;
};

/**
 * Get analysis configuration for a level
 */
export const getAnalysisConfig = (levelId: number) => {
  const config = getLevelConfig(levelId);
  return config.analysis;
};