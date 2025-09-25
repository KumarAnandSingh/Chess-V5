import React from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { X, Flag, RotateCcw } from 'lucide-react';
import { GameLevel } from './GameLevel';
import { colors, borderRadius } from '../../lib/design-tokens';

interface GameplayHeaderProps {
  currentLevel: GameLevel;
  onQuit: () => void;
  onForfeit: () => void;
  onNewGame: () => void;
}

const GameplayHeader: React.FC<GameplayHeaderProps> = ({
  currentLevel,
  onQuit,
  onForfeit,
  onNewGame
}) => {
  const getLevelColor = () => {
    if (currentLevel.id <= 8) return colors.success[500];
    if (currentLevel.id <= 16) return colors.warning[500];
    if (currentLevel.id <= 20) return '#f97316'; // orange-500
    if (currentLevel.id <= 23) return colors.error[500];
    return '#7c2d12'; // brown-900
  };

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Badge
          className="px-3 py-1 min-h-[20px] text-white font-semibold text-sm"
          style={{
            backgroundColor: getLevelColor(),
            color: colors.neutral[0],
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: borderRadius.full
          }}
        >
          {currentLevel.icon}
          <span className="ml-1">Level {currentLevel.id}</span>
        </Badge>
        <div>
          <h2
            className="text-xl font-bold"
            style={{ color: colors.neutral[900] }}
          >
            {currentLevel.name}
          </h2>
          <p
            className="text-sm"
            style={{ color: colors.neutral[600] }}
          >
            vs {currentLevel.botName}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={onQuit}
          variant="destructive"
          size="sm"
          className="min-h-[44px]"
          style={{
            backgroundColor: colors.error[600],
            color: colors.neutral[0],
            borderColor: colors.error[600],
            borderRadius: borderRadius.md
          }}
        >
          <X className="h-4 w-4 mr-1" />
          Quit
        </Button>
        <Button
          onClick={onForfeit}
          variant="outline"
          size="sm"
          className="min-h-[44px]"
          style={{
            color: colors.error[600],
            borderColor: colors.error[600],
            backgroundColor: colors.error[50],
            borderRadius: borderRadius.md
          }}
        >
          <Flag className="h-4 w-4 mr-1" />
          Forfeit
        </Button>
        <Button
          onClick={onNewGame}
          size="sm"
          className="min-h-[44px]"
          style={{
            backgroundColor: colors.primary[600],
            color: colors.neutral[0],
            borderRadius: borderRadius.md
          }}
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          New Game
        </Button>
      </div>
    </div>
  );
};

export default GameplayHeader;