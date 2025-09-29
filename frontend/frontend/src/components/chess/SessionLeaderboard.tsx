import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Trophy,
  Star,
  Clock,
  Target,
  TrendingUp,
  Medal,
  Award,
  BarChart3,
  Calendar,
  Filter
} from 'lucide-react';
import { GamePerformanceData, PerformanceStats } from '../../hooks/usePerformanceTracking';

interface SessionLeaderboardProps {
  stats: PerformanceStats;
  gameHistory: GamePerformanceData[];
  className?: string;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'hard': return 'bg-orange-100 text-orange-800';
    case 'expert': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const formatDuration = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  const mins = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return mins > 0 ? `${mins}m ${remainingSeconds}s` : `${remainingSeconds}s`;
};

const StarRating: React.FC<{ stars: number; size?: 'sm' | 'md' }> = ({
  stars,
  size = 'sm'
}) => {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3].map((i) => (
        <Star
          key={i}
          className={`${sizeClass} ${
            i <= stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  color?: string;
}> = ({ title, value, icon, subtitle, color = 'text-blue-600' }) => (
  <Card className="p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      <div className={`${color.replace('text-', 'text-').replace('600', '500')}`}>
        {icon}
      </div>
    </div>
  </Card>
);

export const SessionLeaderboard: React.FC<SessionLeaderboardProps> = ({
  stats,
  gameHistory,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'history' | 'achievements'>('stats');
  const [sortBy, setSortBy] = useState<'pi' | 'stars' | 'time'>('pi');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  // Filter and sort games
  const filteredGames = gameHistory
    .filter(game => filterDifficulty === 'all' || game.difficulty === filterDifficulty)
    .sort((a, b) => {
      switch (sortBy) {
        case 'pi': return b.performanceIndex - a.performanceIndex;
        case 'stars': return b.starRating - a.starRating;
        case 'time': return a.totalTime - b.totalTime;
        default: return 0;
      }
    });

  // Calculate achievements
  const achievements = {
    perfectGames: gameHistory.filter(g => g.starRating === 3).length,
    winStreak: (() => {
      let current = 0;
      let max = 0;
      for (const game of [...gameHistory].reverse()) {
        if (game.result === 'win') {
          current++;
          max = Math.max(max, current);
        } else {
          current = 0;
        }
      }
      return max;
    })(),
    speedGames: gameHistory.filter(g => g.averageTimePerMove <= 5).length,
    noHintGames: gameHistory.filter(g => g.hintsUsed === 0 && g.undosUsed === 0).length,
    expertWins: gameHistory.filter(g => g.difficulty === 'expert' && g.result === 'win').length
  };

  if (stats.totalGames === 0) {
    return (
      <Card className={`p-8 text-center ${className}`}>
        <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Games Yet</h3>
        <p className="text-gray-500">Start playing to see your performance statistics!</p>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Performance</h2>
        <p className="text-gray-600">Your chess performance this session</p>
        <Badge variant="secondary" className="mt-2">
          Guest Session • {stats.totalGames} games played
        </Badge>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'stats', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'history', label: 'Game History', icon: <Calendar className="w-4 h-4" /> },
          { id: 'achievements', label: 'Achievements', icon: <Award className="w-4 h-4" /> }
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
      {activeTab === 'stats' && (
        <div className="space-y-6">
          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="Average PI"
              value={stats.averagePI}
              icon={<TrendingUp className="w-6 h-6" />}
              subtitle="Performance Index"
              color="text-blue-600"
            />
            <StatCard
              title="Best Game"
              value={stats.bestPI}
              icon={<Trophy className="w-6 h-6" />}
              subtitle="Peak Performance"
              color="text-yellow-600"
            />
            <StatCard
              title="Win Rate"
              value={`${Math.round((stats.wins / stats.totalGames) * 100)}%`}
              icon={<Target className="w-6 h-6" />}
              subtitle={`${stats.wins}/${stats.totalGames}`}
              color="text-green-600"
            />
            <StatCard
              title="Average Stars"
              value={stats.averageStars.toFixed(1)}
              icon={<Star className="w-6 h-6" />}
              subtitle={`${stats.totalStars} total`}
              color="text-yellow-600"
            />
          </div>

          {/* Best Game Highlight */}
          {stats.bestGame && (
            <Card className="p-6 border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Medal className="w-5 h-5 text-yellow-600" />
                  Best Performance
                </h3>
                <div className="flex items-center gap-2">
                  <StarRating stars={stats.bestGame.starRating} />
                  <Badge className={getDifficultyColor(stats.bestGame.difficulty)}>
                    {stats.bestGame.difficulty}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Performance Index</p>
                  <p className="font-bold text-blue-600 text-lg">{stats.bestGame.performanceIndex}</p>
                </div>
                <div>
                  <p className="text-gray-600">Result</p>
                  <p className="font-bold text-green-600 capitalize">{stats.bestGame.result}</p>
                </div>
                <div>
                  <p className="text-gray-600">Duration</p>
                  <p className="font-bold">{formatDuration(stats.bestGame.totalTime)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Accuracy</p>
                  <p className="font-bold">
                    {Math.round(((stats.bestGame.playerMoves - stats.bestGame.blunders - stats.bestGame.mistakes) / stats.bestGame.playerMoves) * 100)}%
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Recent Games */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Games</h3>
            <div className="space-y-3">
              {stats.recentGames.slice(0, 5).map((game, index) => (
                <Card key={game.gameId} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-center min-w-[3rem]">
                        <div className="text-lg font-bold text-blue-600">{game.performanceIndex}</div>
                        <div className="text-xs text-gray-500">PI</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${
                            game.result === 'win' ? 'text-green-600' :
                            game.result === 'draw' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {game.result.toUpperCase()}
                          </span>
                          <Badge className={getDifficultyColor(game.difficulty)} size="sm">
                            {game.difficulty}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {game.playerMoves} moves • {formatDuration(game.totalTime)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StarRating stars={game.starRating} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="text-sm border rounded-md px-2 py-1"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              {['pi', 'stars', 'time'].map((sort) => (
                <Button
                  key={sort}
                  variant={sortBy === sort ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy(sort as any)}
                >
                  {sort === 'pi' ? 'PI' : sort === 'stars' ? 'Stars' : 'Time'}
                </Button>
              ))}
            </div>
          </div>

          {/* Games List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredGames.map((game, index) => (
              <Card key={game.gameId} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[2rem]">
                      <div className="text-sm font-bold text-gray-600">#{index + 1}</div>
                    </div>
                    <div className="text-center min-w-[3rem]">
                      <div className="text-lg font-bold text-blue-600">{game.performanceIndex}</div>
                      <div className="text-xs text-gray-500">PI</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-semibold text-sm ${
                          game.result === 'win' ? 'text-green-600' :
                          game.result === 'draw' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {game.result.toUpperCase()}
                        </span>
                        <Badge className={getDifficultyColor(game.difficulty)} size="sm">
                          {game.difficulty}
                        </Badge>
                        <StarRating stars={game.starRating} />
                      </div>
                      <div className="text-xs text-gray-600">
                        {game.playerMoves} moves • {formatDuration(game.totalTime)} •
                        {game.averageTimePerMove.toFixed(1)}s avg
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <div>B:{game.blunders} M:{game.mistakes} I:{game.inaccuracies}</div>
                    <div>H:{game.hintsUsed} U:{game.undosUsed}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Session Achievements
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Perfect Games (3★)</span>
                <Badge variant={achievements.perfectGames > 0 ? 'default' : 'secondary'}>
                  {achievements.perfectGames}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Best Win Streak</span>
                <Badge variant={achievements.winStreak > 0 ? 'default' : 'secondary'}>
                  {achievements.winStreak}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Speed Games (&lt;5s avg)</span>
                <Badge variant={achievements.speedGames > 0 ? 'default' : 'secondary'}>
                  {achievements.speedGames}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">No-Assist Games</span>
                <Badge variant={achievements.noHintGames > 0 ? 'default' : 'secondary'}>
                  {achievements.noHintGames}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Expert Victories</span>
                <Badge variant={achievements.expertWins > 0 ? 'default' : 'secondary'}>
                  {achievements.expertWins}
                </Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Progress Tracking
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Win Rate</span>
                  <span className="font-medium">{Math.round((stats.wins / stats.totalGames) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(stats.wins / stats.totalGames) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Average PI</span>
                  <span className="font-medium">{stats.averagePI}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${stats.averagePI}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Star Average</span>
                  <span className="font-medium">{stats.averageStars.toFixed(1)}/3.0</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${(stats.averageStars / 3) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SessionLeaderboard;