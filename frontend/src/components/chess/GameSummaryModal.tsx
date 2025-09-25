import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';\nimport { RotateCcw, Trophy, Award, Users, TrendingUp } from 'lucide-react';
import { colors, borderRadius, shadows } from '../../lib/design-tokens';

interface GameSummary {
  result: 'win' | 'lose' | 'draw';
  playerMoves: number;
  proMoves: number;
  timeTaken: number;
  level: number;
  performance: 'excellent' | 'good' | 'average' | 'needs_improvement';
  tips: string[];
  pointsEarned: number;
}

interface GameSummaryModalProps {
  gameSummary: GameSummary;
  selectedLevel: number;
  onPlayAgain: () => void;
  onNextLevel: () => void;
  onLeaderboard: () => void;
}

const GameSummaryModal: React.FC<GameSummaryModalProps> = ({
  gameSummary,
  selectedLevel,
  onPlayAgain,
  onNextLevel,
  onLeaderboard
}) => {
  const getResultColor = () => {
    switch (gameSummary.result) {
      case 'win': return { bg: colors.success[50], border: colors.success[500] };
      case 'lose': return { bg: colors.error[50], border: colors.error[500] };
      default: return { bg: colors.warning[50], border: colors.warning[500] };
    }
  };

  const getPerformanceColor = () => {
    switch (gameSummary.performance) {
      case 'excellent': return { bg: colors.success[100], text: colors.success[800] };
      case 'good': return { bg: colors.primary[100], text: colors.primary[800] };
      case 'average': return { bg: colors.warning[100], text: colors.warning[800] };
      default: return { bg: colors.error[100], text: colors.error[800] };
    }
  };

  const resultColor = getResultColor();
  const performanceColor = getPerformanceColor();

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Card
        style={{
          backgroundColor: resultColor.bg,
          borderColor: resultColor.border,
          borderWidth: '1px',
          borderStyle: 'solid',
          borderRadius: borderRadius.lg,
          boxShadow: shadows.lg
        }}
      >
        <CardHeader>
          <CardTitle className="text-center">
            {gameSummary.result === 'win' ? '🏆 Victory!' :
             gameSummary.result === 'lose' ? '😔 Defeat' : '🤝 Draw'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">+{gameSummary.pointsEarned} points</div>
            <Badge
              className="text-lg px-4 py-2"
              style={{
                backgroundColor: performanceColor.bg,
                color: performanceColor.text,
                borderRadius: borderRadius.full
              }}
            >
              {gameSummary.performance.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <Card
              className="p-4"
              style={{ backgroundColor: colors.neutral[0], borderRadius: borderRadius.lg }}
            >
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" /> Performance Comparison
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Your moves:</span>
                  <span className="font-bold">{gameSummary.playerMoves}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pro moves:</span>
                  <span className="font-bold">{gameSummary.proMoves}</span>
                </div>
                <div className="flex justify-between">
                  <span>Efficiency:</span>
                  <span
                    className="font-bold"
                    style={{
                      color: gameSummary.playerMoves <= gameSummary.proMoves * 1.2
                        ? colors.success[600]
                        : gameSummary.playerMoves <= gameSummary.proMoves * 1.5
                        ? colors.warning[600]
                        : colors.error[600]
                    }}
                  >
                    {Math.round((gameSummary.proMoves / gameSummary.playerMoves) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Time taken:</span>
                  <span className="font-bold">
                    {Math.floor(gameSummary.timeTaken / 60000)}:
                    {String(Math.floor((gameSummary.timeTaken % 60000) / 1000)).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </Card>

            <Card
              className="p-4"
              style={{ backgroundColor: colors.neutral[0], borderRadius: borderRadius.lg }}
            >
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Tips & Improvement
              </h3>
              <ul className="space-y-1 text-sm">
                {gameSummary.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span style={{ color: colors.success[500] }}>•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={onPlayAgain}
              size="lg"
              style={{
                backgroundColor: colors.primary[600],
                color: colors.neutral[0],
                borderRadius: borderRadius.md
              }}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Play Again
            </Button>
            {gameSummary.result === 'win' && selectedLevel < 25 && (
              <Button
                onClick={onNextLevel}
                size="lg"
                style={{
                  backgroundColor: colors.success[600],
                  color: colors.neutral[0],
                  borderRadius: borderRadius.md
                }}
              >
                <Award className="h-4 w-4 mr-2" />
                Next Level
              </Button>
            )}
            <Button
              onClick={onLeaderboard}
              variant="outline"
              size="lg"
              style={{
                borderColor: colors.neutral[300],
                borderRadius: borderRadius.md
              }}
            >
              <Trophy className="h-4 w-4 mr-2" />
              Leaderboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameSummaryModal;