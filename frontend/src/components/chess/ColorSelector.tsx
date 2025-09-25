import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { GameLevel } from './GameLevel';
import { colors, borderRadius } from '../../lib/design-tokens';

interface ColorSelectorProps {
  currentLevel: GameLevel | null;
  onColorSelect: (color: 'white' | 'black') => void;
  onBackClick: () => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  currentLevel,
  onColorSelect,
  onBackClick
}) => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Choose Your Color</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: colors.neutral[900] }}
            >
              Playing against: {currentLevel?.botName || 'Computer'}
            </h3>
            <p style={{ color: colors.neutral[600] }}>
              {currentLevel?.description || 'Select a difficulty level to play'}
            </p>
          </div>

          <div className="flex justify-center gap-8">
            <Button
              onClick={() => onColorSelect('white')}
              size="lg"
              variant="outline"
              className="flex flex-col items-center gap-2 h-24 w-32"
              style={{
                borderColor: colors.neutral[300],
                borderRadius: borderRadius.lg
              }}
            >
              <div className="text-4xl">♔</div>
              <span style={{ color: colors.neutral[900] }}>White</span>
              <span
                className="text-xs"
                style={{ color: colors.neutral[500] }}
              >
                You move first
              </span>
            </Button>

            <Button
              onClick={() => onColorSelect('black')}
              size="lg"
              variant="outline"
              className="flex flex-col items-center gap-2 h-24 w-32"
              style={{
                borderColor: colors.neutral[300],
                borderRadius: borderRadius.lg
              }}
            >
              <div className="text-4xl">♚</div>
              <span style={{ color: colors.neutral[900] }}>Black</span>
              <span
                className="text-xs"
                style={{ color: colors.neutral[500] }}
              >
                Computer starts
              </span>
            </Button>
          </div>

          <div className="mt-6 text-center">
            <Button
              onClick={onBackClick}
              variant="ghost"
              style={{ color: colors.neutral[600] }}
            >
              Back to Level Selection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorSelector;