import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Crown, Play, Trophy } from 'lucide-react';
import { GameLevel, GameLevelDisplay, GAME_LEVELS } from './GameLevel';
import { colors, shadows, borderRadius } from '../../lib/design-tokens';

interface GameLevelSelectorProps {
  selectedLevel: number;
  currentLevel: GameLevel | null;
  onLevelSelect: (level: number) => void;
  onPlayClick: () => void;
  onLeaderboardClick: () => void;
}

const GameLevelSelector: React.FC<GameLevelSelectorProps> = ({
  selectedLevel,
  currentLevel,
  onLevelSelect,
  onPlayClick,
  onLeaderboardClick
}) => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <Card className="mb-6" style={{ boxShadow: shadows.md }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-6 w-6" />
            Choose Your Challenge Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {GAME_LEVELS.slice(0, 25).map((level) => (
              <GameLevelDisplay
                key={level.id}
                level={level}
                isActive={selectedLevel === level.id}
                onClick={() => onLevelSelect(level.id)}
              />
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <Button
              onClick={onPlayClick}
              disabled={!selectedLevel || !currentLevel}
              size="lg"
              className="flex items-center gap-2"
              style={{
                backgroundColor: colors.success[600],
                color: colors.neutral[0],
                borderRadius: borderRadius.md,
                opacity: (!selectedLevel || !currentLevel) ? 0.5 : 1
              }}
            >
              <Play className="h-5 w-5" />
              PLAY vs {currentLevel?.botName || 'Computer'}
            </Button>
            <Button
              onClick={onLeaderboardClick}
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <Trophy className="h-4 w-4" />
              Leaderboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameLevelSelector;