# Performance Tracking Implementation

## Overview

This implementation provides exact performance tracking according to the specified requirements, including:
- Level configuration system with boss levels and aid restrictions
- Precise Performance Index (PI) calculation
- Star rating with aid usage caps
- Toast notifications for aid usage
- Exact timing calculations with linear interpolation
- Configurable analysis depth and centipawn thresholds

## ✅ Implementation Status

All requirements have been implemented and tested:

1. **✅ Level Configuration System** - `/src/config/levelConfig.ts`
2. **✅ Exact PI Calculation** - Updated in `/src/hooks/usePerformanceTracking.ts`
3. **✅ Star Rating with Aid Caps** - Boss levels cap at 1★, regular at 2★
4. **✅ Toast Notifications** - `/src/components/ui/ToastNotification.tsx`
5. **✅ Timing Calculations** - Exact linear interpolation for 8-20s range
6. **✅ Analysis Configuration** - Depth 12, thresholds I≥40, M≥80, B≥150
7. **✅ Sanity Check Verified** - Level 14 example passes: PI=85, Stars=2★

## File Structure

```
src/
├── config/
│   └── levelConfig.ts                     # Level configurations with parMoves, boss flags
├── hooks/
│   └── usePerformanceTracking.ts          # Updated with exact PI/star formulas
├── components/
│   ├── ui/
│   │   └── ToastNotification.tsx          # Toast notifications for aid usage
│   ├── chess/
│   │   └── PlayVsComputer.tsx             # Updated to use new system
│   ├── test/
│   │   └── PerformanceTestComponent.tsx   # Test suite component
│   └── examples/
│       └── PerformanceTrackingExample.tsx # Usage demonstration
```

## Core Formulas

### Performance Index Calculation
```typescript
PI = clamp(
  Math.round(
    0.5 × resultScore +
    0.2 × qualityScore +
    0.2 × efficiencyScore +
    0.1 × timeScore -
    penalty
  ),
  0, 100
)
```

Where:
- `resultScore`: win=100, draw=60, loss=0
- `qualityScore`: max(0, 100 - (B×25 + M×10 + I×5))
- `efficiencyScore`: clamp(round(100 × √(parMoves/yourMoves)), 30, 100)
- `timeScore`: Complex linear interpolation (see below)
- `penalty`: hintsUsed×15 + undosUsed×10

### Time Score Calculation
```typescript
if (avgSecPerMove <= 8) timeScore = 100
else if (avgSecPerMove <= 20) timeScore = round(100 - ((avgSecPerMove - 8) / 12) × 50)
else {
  // For >20s: scale 50→30 over 30s range
  const extraTime = avgSecPerMove - 20;
  const scaleFactor = min(extraTime / 30, 1);
  timeScore = round(50 - (scaleFactor × 20));
}
```

### Star Rating with Aid Caps
```typescript
let cap = 3;
if (allowAids && (hintsUsed > 0 || undosUsed > 0)) {
  cap = min(cap, isBoss ? 1 : 2);
}

if (result === 'win' && PI >= 85 && hintsUsed === 0) return min(3, cap);
if (result === 'win' && PI >= 65) return min(2, cap);
if ((result === 'win' || result === 'draw') && PI >= 50) return min(1, cap);
return 0;
```

## Level Configuration

Levels are configured in `/src/config/levelConfig.ts`:

```typescript
interface LevelConfig {
  levelId: number;
  parMoves: number;           // Target moves for level
  boss: boolean;              // Boss level flag
  allowAids: boolean;         // Whether aids are allowed
  bossStarCapWithAids: number; // Star cap when aids used (1 for boss)
  analysis: {
    depth: number;            // Analysis depth (default: 12)
    cpThresholds: {           // Centipawn thresholds
      I: number;              // Inaccuracy ≥40
      M: number;              // Mistake ≥80
      B: number;              // Blunder ≥150
    };
  };
}
```

Example boss levels: 5, 10, 15

## Toast Notifications

When aids are used, toast notifications appear:
- Regular levels: "Hint used — max 2★ this game" / "Undo used — max 2★ this game"
- Boss levels: "Aid used — max 1★ this game"

## Output Schema

The exact output format matches the specification:

```typescript
{
  "userId": "abc123",
  "levelId": 14,
  "result": "win",
  "stars": 2,
  "PI": 85,
  "yourMoves": 56,
  "parMoves": 52,
  "avgSecPerMove": 9.5,
  "I": 2,
  "M": 1,
  "B": 0,
  "hintsUsed": 0,
  "undosUsed": 1,
  "pgn": "1. e4 e5 2. Nf3...",
  "moveTimesMs": [1500, 2300, 1800, ...],
  "completedAt": "2025-09-26T12:34:56Z"
}
```

## Sanity Check Verification

✅ **PASSED**: Level 14, wins in 56 moves (par 52), 9.5s avg, I=2 M=1 B=0, undos=1
- Expected: PI=85, Stars=2★
- Actual: PI=85, Stars=2★

## Usage Example

```typescript
import { usePerformanceTracking } from '../hooks/usePerformanceTracking';
import { useToast } from '../components/ui/ToastNotification';

const MyComponent = ({ levelId = 14 }) => {
  const {
    startGame,
    recordMove,
    recordHint,
    recordUndo,
    endGame,
    isCurrentLevelBoss
  } = usePerformanceTracking();

  const { showHintToast, showUndoToast } = useToast();

  // Start a game
  const gameId = startGame(levelId);

  // Record a move (called after each player move)
  await recordMove('Nf3', 0.2, 0.15, 2.5);

  // Use hint with toast
  const handleHint = () => {
    recordHint();
    showHintToast(isCurrentLevelBoss());
  };

  // End game and get results
  const results = endGame('win', game.pgn());
  console.log(`PI: ${results.PI}, Stars: ${results.stars}`);
};
```

## Testing

Run the test component to verify all calculations:

```typescript
import { PerformanceTestComponent } from '../components/test/PerformanceTestComponent';

// All tests should pass, including the sanity check
```

## Integration Notes

- Updated `PlayVsComputer.tsx` to use new level-based system
- Toast notifications integrated and working
- All calculations verified against specification
- Backward compatibility maintained with legacy fields
- Performance data is stored in sessionStorage
- PGN and move times are properly captured

## Implementation Complete ✅

All requirements have been implemented exactly as specified:
- Level configuration system ✅
- Exact PI calculation ✅
- Star rating with aid caps ✅
- Toast notifications ✅
- Timing calculations ✅
- Analysis configuration ✅
- Sanity check verification ✅
- Complete integration ✅