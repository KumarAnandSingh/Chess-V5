# Chess Academy Performance Tracking System

## Overview

The Chess Academy features a comprehensive performance tracking system that provides detailed analytics for chess games. The system calculates Performance Index (PI) scores, star ratings, and detailed move analysis for each game played.

## Key Features

### 🎯 Performance Index (PI) Calculation
- **Range**: 0-100 scale
- **Formula**: `0.5×Result + 0.2×Quality + 0.2×Efficiency + 0.1×Time - Penalties`
- **Real-time**: Calculated after each completed game

### ⭐ Star Rating System
- **3★**: Win AND PI ≥ 85 AND no hints used
- **2★**: Win AND PI ≥ 65
- **1★**: (Win OR Draw) AND PI ≥ 50
- **0★**: Otherwise

### 📊 Move Analysis
- **Inaccuracies**: Centipawn loss ≥ 40 and < 80
- **Mistakes**: Centipawn loss ≥ 80 and < 150
- **Blunders**: Centipawn loss ≥ 150
- **Analysis Depth**: Configurable per level (default: 12)

### 🎮 Level Configuration
- **Boss Levels**: Special levels (5, 10, 15) with stricter star caps
- **Par Moves**: Target move count for efficiency scoring
- **Aid Restrictions**: Configurable hint/undo availability

## Performance Index Components

### 1. Result Score (50% weight)
```typescript
ResultScore = {
  Win: 100,
  Draw: 60,
  Loss: 0,
  Aborted: 0
}
```

### 2. Quality Score (20% weight)
```typescript
QualityScore = max(0, 100 - (Blunders×25 + Mistakes×10 + Inaccuracies×5))
```

### 3. Efficiency Score (20% weight)
```typescript
ratio = parMoves / max(yourMoves, 1)
EfficiencyScore = clamp(round(100 × ratio^0.5), 30, 100)
```

### 4. Time Score (10% weight)
```typescript
if (avgSecPerMove <= 8): 100
if (8 < avgSecPerMove <= 20): linear 100→50
if (avgSecPerMove > 20): scaled 50→30
```

### 5. Aid Penalties
```typescript
Penalty = hintsUsed × 15 + undosUsed × 10
```

## Star Rating Rules

### Standard Levels
- **No Aid Restrictions**: Full star potential
- **With Aids Used**: Max 2★ (even if PI qualifies for 3★)

### Boss Levels
- **No Aid Restrictions**: Full star potential
- **With Aids Used**: Max 1★ (strict penalty)

### Aid Usage Notifications
- Regular levels: "Hint/Undo used — max 2★ this game"
- Boss levels: "Aid used — max 1★ this game"

## Data Schema

### Game Performance Data
```typescript
interface GamePerformanceData {
  userId: string;
  levelId: number;
  result: 'win' | 'draw' | 'loss' | 'aborted';
  stars: number;
  PI: number;
  yourMoves: number;
  parMoves: number;
  avgSecPerMove: number;
  I: number; // Inaccuracies
  M: number; // Mistakes
  B: number; // Blunders
  hintsUsed: number;
  undosUsed: number;
  pgn: string;
  moveTimesMs: number[];
  completedAt: string;
}
```

### Level Configuration
```typescript
interface LevelConfig {
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
```

## Example Calculation

**Level 14 Sanity Check:**
- Par Moves: 52, Your Moves: 56
- Average Time: 9.5s/move
- Errors: I=2, M=1, B=0
- Aids: hints=0, undos=1
- Result: Win

**Calculation:**
1. ResultScore = 100 (win)
2. QualityScore = 100 - (0×25 + 1×10 + 2×5) = 80
3. EfficiencyScore = round(100 × (52/56)^0.5) = 96
4. TimeScore ≈ 96 (9.5s in linear range)
5. Penalty = 0×15 + 1×10 = 10

**Final PI:** 0.5×100 + 0.2×80 + 0.2×96 + 0.1×96 - 10 = **85**

**Stars:** Win + PI≥85 but undo used → **2★** (capped due to aid usage)

## Session-Based Tracking

### Guest User System
- **Unique IDs**: Generated per session using crypto.randomUUID()
- **Persistence**: SessionStorage (resets on page refresh)
- **No Authentication**: Guest-friendly experience

### Progress Analytics
- **Game History**: Complete record of all games in session
- **Performance Trends**: PI and star progression
- **Best Performance**: Highest PI game tracking
- **Statistics**: Win/draw/loss ratios, average performance

## Implementation Files

### Core System
- `src/hooks/usePerformanceTracking.ts` - Main tracking logic
- `src/config/levelConfig.ts` - Level configuration system

### UI Components
- `src/components/chess/PerformanceAnalysisModal.tsx` - Post-game analysis
- `src/components/chess/SessionLeaderboard.tsx` - Performance history
- `src/components/ui/ToastNotification.tsx` - Aid usage notifications

### Integration
- `src/components/chess/PlayVsComputer.tsx` - Main chess component
- `src/components/chess/PlayerAvatar.tsx` - Player profiles with captured pieces
- `src/components/chess/MoveListPanel.tsx` - Move history display

## Usage

### Starting a Game
```typescript
const { startGame } = usePerformanceTracking();
const gameId = startGame(levelId);
```

### Recording Moves
```typescript
const { recordMove } = usePerformanceTracking();
await recordMove(move, evalBefore, evalAfter, timeSpent);
```

### Recording Aid Usage
```typescript
const { recordHint, recordUndo } = usePerformanceTracking();
recordHint(); // Triggers toast notification
recordUndo(); // Triggers toast notification
```

### Ending a Game
```typescript
const { endGame } = usePerformanceTracking();
const gameData = endGame(result, pgnString);
```

## Quality Assurance

### Deterministic Testing
- Fixed synthetic PGNs with known I/M/B counts
- PI calculations verified within ±1 accuracy
- Star rating validation for all scenarios

### Edge Cases Handled
- Division by zero protection
- Minimum efficiency score (30)
- Proper time score scaling for extreme times
- Abort handling (shows "Aborted" instead of performance)

## Performance Benefits

### For Players
- **Skill Assessment**: Understand chess improvement areas
- **Goal Setting**: Star ratings provide clear targets
- **Progress Tracking**: Session-based improvement monitoring
- **Learning Tool**: Move quality feedback promotes better play

### For Analysis
- **Standardized Metrics**: Comparable performance across games
- **Detailed Insights**: Move-by-move analysis with timing
- **Efficiency Tracking**: Optimization vs speed trade-offs
- **Aid Impact**: Understanding help usage effects on performance

This system provides a comprehensive, chess.com-style performance tracking experience while maintaining simplicity for guest users and providing deep insights for chess improvement.