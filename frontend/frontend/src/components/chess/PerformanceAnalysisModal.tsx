import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import {
  Trophy,
  Clock,
  Target,
  TrendingUp,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Lightbulb,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import { GamePerformanceData, MoveAnalysis } from '../../hooks/usePerformanceTracking';

interface PerformanceAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameData: GamePerformanceData;
  onRematch?: () => void;
  onNextLevel?: () => void;
  onChangeBot?: () => void;
}

const getResultIcon = (result: 'win' | 'draw' | 'loss') => {
  switch (result) {
    case 'win': return '🏆';
    case 'draw': return '🤝';
    case 'loss': return '💪';
  }
};

const getResultMessage = (result: 'win' | 'draw' | 'loss', stars: number) => {
  if (result === 'win' && stars === 3) {
    return 'Perfect Victory! Outstanding performance!';
  } else if (result === 'win' && stars === 2) {
    return 'Excellent Victory! Great job!';
  } else if (result === 'win') {
    return 'Victory! Well played!';
  } else if (result === 'draw') {
    return 'Draw! Good defensive play!';
  } else {
    return 'Good effort! Learn and improve!';
  }
};

const StarRating: React.FC<{ stars: number; size?: 'sm' | 'md' | 'lg' }> = ({
  stars,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3].map((i) => (
        <Star
          key={i}
          className={`${sizeClasses[size]} ${
            i <= stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

const PerformanceCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ title, icon, children, className = '' }) => (
  <Card className={`p-4 ${className}`}>
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <h3 className="font-semibold text-sm text-gray-700">{title}</h3>
    </div>
    {children}
  </Card>
);

const MoveClassificationBadge: React.FC<{ classification: MoveAnalysis['classification'] }> = ({
  classification
}) => {
  const config = {
    brilliant: { color: 'bg-purple-100 text-purple-800', label: 'Brilliant!' },
    excellent: { color: 'bg-green-100 text-green-800', label: 'Excellent' },
    good: { color: 'bg-blue-100 text-blue-800', label: 'Good' },
    inaccuracy: { color: 'bg-yellow-100 text-yellow-800', label: 'Inaccuracy' },
    mistake: { color: 'bg-orange-100 text-orange-800', label: 'Mistake' },
    blunder: { color: 'bg-red-100 text-red-800', label: 'Blunder' }
  };

  const { color, label } = config[classification];

  return (
    <Badge className={`${color} text-xs px-2 py-1`}>
      {label}
    </Badge>
  );
};

export const PerformanceAnalysisModal: React.FC<PerformanceAnalysisModalProps> = ({
  isOpen,
  onClose,
  gameData,
  onRematch,
  onNextLevel,
  onChangeBot
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'moves' | 'analysis'>('overview');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return mins > 0 ? `${mins}m ${remainingSeconds}s` : `${remainingSeconds}s`;
  };

  const getKeyMoments = () => {
    const moves = gameData.moves || [];
    const criticalMoves = moves.filter(move =>
      move.classification === 'brilliant' ||
      move.classification === 'blunder' ||
      move.centipawnLoss > 100
    ).slice(0, 3);

    if (criticalMoves.length === 0 && moves.length > 0) {
      // Show some good moves if no critical moments
      return moves.filter(move => move.classification === 'excellent' || move.classification === 'good').slice(0, 2);
    }

    return criticalMoves;
  };

  const keyMoments = getKeyMoments();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex flex-col items-center gap-3">
              {/* Result Header */}
              <div className="flex items-center gap-4">
                <span className="text-4xl">{getResultIcon(gameData.result)}</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {gameData.result === 'win' ? 'Victory!' :
                     gameData.result === 'draw' ? 'Draw!' : 'Good Game!'}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {getResultMessage(gameData.result, gameData.starRating)}
                  </p>
                </div>
              </div>

              {/* Star Rating and PI */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <StarRating stars={gameData.starRating} size="lg" />
                  <p className="text-xs text-gray-500 mt-1">Star Rating</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {gameData.performanceIndex}
                  </div>
                  <p className="text-xs text-gray-500">Performance Index</p>
                </div>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'moves', label: 'Move Analysis', icon: <Target className="w-4 h-4" /> },
            { id: 'analysis', label: 'Key Moments', icon: <TrendingUp className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Moves Comparison */}
            <PerformanceCard
              title="Moves vs Par"
              icon={<Target className="w-5 h-5 text-blue-600" />}
            >
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Your moves:</span>
                  <span className="font-semibold">{gameData.playerMoves}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Par moves:</span>
                  <span className="font-semibold">{gameData.parMoves}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={gameData.playerMoves <= gameData.parMoves ? 'text-green-600' : 'text-orange-600'}>
                    Efficiency:
                  </span>
                  <span className={`font-semibold ${
                    gameData.playerMoves <= gameData.parMoves ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {gameData.playerMoves <= gameData.parMoves ? 'Great!' : '+' + (gameData.playerMoves - gameData.parMoves)}
                  </span>
                </div>
              </div>
            </PerformanceCard>

            {/* Accuracy Breakdown */}
            <PerformanceCard
              title="Move Accuracy"
              icon={<CheckCircle className="w-5 h-5 text-green-600" />}
            >
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Inaccuracies:</span>
                  <span className="font-semibold text-yellow-600">{gameData.inaccuracies}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Mistakes:</span>
                  <span className="font-semibold text-orange-600">{gameData.mistakes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Blunders:</span>
                  <span className="font-semibold text-red-600">{gameData.blunders}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Accuracy:</span>
                    <span className="font-semibold text-green-600">
                      {gameData.playerMoves > 0
                        ? Math.round(((gameData.playerMoves - gameData.blunders - gameData.mistakes) / gameData.playerMoves) * 100)
                        : 100}%
                    </span>
                  </div>
                </div>
              </div>
            </PerformanceCard>

            {/* Time Analysis */}
            <PerformanceCard
              title="Time Management"
              icon={<Clock className="w-5 h-5 text-purple-600" />}
            >
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total time:</span>
                  <span className="font-semibold">{formatDuration(gameData.totalTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg per move:</span>
                  <span className="font-semibold">
                    {gameData.averageTimePerMove.toFixed(1)}s
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={gameData.averageTimePerMove <= 15 ? 'text-green-600' : 'text-orange-600'}>
                    Tempo:
                  </span>
                  <span className={`font-semibold ${
                    gameData.averageTimePerMove <= 8 ? 'text-green-600' :
                    gameData.averageTimePerMove <= 15 ? 'text-yellow-600' : 'text-orange-600'
                  }`}>
                    {gameData.averageTimePerMove <= 8 ? 'Fast' :
                     gameData.averageTimePerMove <= 15 ? 'Good' : 'Slow'}
                  </span>
                </div>
              </div>
            </PerformanceCard>

            {/* Aids Used */}
            <PerformanceCard
              title="Assistance Used"
              icon={<Lightbulb className="w-5 h-5 text-yellow-600" />}
              className="md:col-span-2 lg:col-span-3"
            >
              <div className="flex justify-around">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{gameData.hintsUsed}</div>
                  <p className="text-sm text-gray-600">Hints Used</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{gameData.undosUsed}</div>
                  <p className="text-sm text-gray-600">Undos Used</p>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    gameData.hintsUsed === 0 && gameData.undosUsed === 0 ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {gameData.hintsUsed === 0 && gameData.undosUsed === 0 ? '✓' : '-' + (gameData.hintsUsed * 15 + gameData.undosUsed * 10)}
                  </div>
                  <p className="text-sm text-gray-600">PI Impact</p>
                </div>
              </div>
            </PerformanceCard>
          </div>
        )}

        {activeTab === 'moves' && (
          <div className="space-y-4">
            <div className="max-h-64 overflow-y-auto">
              {gameData.moves && gameData.moves.length > 0 ? (
                <div className="space-y-2">
                  {gameData.moves.map((move, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono font-semibold w-8">
                          {Math.floor(index / 2) + 1}.
                        </span>
                        <span className="font-mono font-medium">{move.move}</span>
                        <MoveClassificationBadge classification={move.classification} />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>±{move.centipawnLoss}cp</span>
                        <span>{move.timeSpent.toFixed(1)}s</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No move data available</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Key Moments</h3>
            {keyMoments.length > 0 ? (
              <div className="space-y-4">
                {keyMoments.map((move, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold">{move.move}</span>
                        <MoveClassificationBadge classification={move.classification} />
                      </div>
                      <span className="text-sm text-gray-500">
                        Move {gameData.moves?.indexOf(move)! + 1}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {move.classification === 'brilliant' && 'Outstanding move! This was the best possible choice.'}
                      {move.classification === 'excellent' && 'Great move! Very strong play.'}
                      {move.classification === 'blunder' && 'This move lost significant material or position.'}
                      {move.classification === 'mistake' && 'This move gave away some advantage.'}
                      {move.classification === 'inaccuracy' && 'A slight inaccuracy, but not too costly.'}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Evaluation change: ±{move.centipawnLoss} centipawns | Time: {move.timeSpent.toFixed(1)}s
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-gray-500">No critical moments to analyze in this game.</p>
                <p className="text-sm text-gray-400 mt-1">Keep playing to see more detailed analysis!</p>
              </Card>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
          <Button onClick={onRematch} variant="default" className="flex-1">
            <RotateCcw className="w-4 h-4 mr-2" />
            Rematch
          </Button>
          {onNextLevel && (
            <Button onClick={onNextLevel} variant="secondary" className="flex-1">
              <ArrowRight className="w-4 h-4 mr-2" />
              Next Level
            </Button>
          )}
          {onChangeBot && (
            <Button onClick={onChangeBot} variant="outline" className="flex-1">
              Change Bot
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PerformanceAnalysisModal;