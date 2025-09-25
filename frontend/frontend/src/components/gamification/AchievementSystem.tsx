import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Trophy, 
  Star, 
  Crown, 
  Target, 
  Zap, 
  Shield, 
  Sword, 
  Brain,
  Puzzle,
  BookOpen,
  Timer,
  TrendingUp,
  Award,
  Flame,
  Calendar,
  Users,
  Sparkles,
  Medal,
  Gem,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'playing' | 'learning' | 'puzzles' | 'progress' | 'social' | 'special';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  points: number;
  requirement: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  reward?: string;
}

const achievements: Achievement[] = [
  // Playing Category
  {
    id: 'first-win',
    title: 'First Victory',
    description: 'Win your first game against any opponent',
    icon: <Trophy className="w-6 h-6" />,
    category: 'playing',
    tier: 'bronze',
    points: 10,
    requirement: 'Win 1 game',
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    unlockedAt: new Date('2024-01-15'),
    rarity: 'common',
    reward: '+10 XP'
  },
  {
    id: 'ten-wins',
    title: 'Winning Streak',
    description: 'Achieve 10 victories in total',
    icon: <Flame className="w-6 h-6" />,
    category: 'playing',
    tier: 'silver',
    points: 25,
    requirement: 'Win 10 games',
    progress: 7,
    maxProgress: 10,
    unlocked: false,
    rarity: 'common',
    reward: '+25 XP'
  },
  {
    id: 'rating-milestone',
    title: 'Rating Climber',
    description: 'Reach a rating of 1400',
    icon: <TrendingUp className="w-6 h-6" />,
    category: 'playing',
    tier: 'gold',
    points: 50,
    requirement: 'Reach 1400 rating',
    progress: 1200,
    maxProgress: 1400,
    unlocked: false,
    rarity: 'uncommon',
    reward: 'New bot opponent unlocked'
  },
  
  // Learning Category
  {
    id: 'first-lesson',
    title: 'Student',
    description: 'Complete your first chess lesson',
    icon: <BookOpen className="w-6 h-6" />,
    category: 'learning',
    tier: 'bronze',
    points: 15,
    requirement: 'Complete 1 lesson',
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    unlockedAt: new Date('2024-01-10'),
    rarity: 'common',
    reward: '+15 XP'
  },
  {
    id: 'scholar',
    title: 'Scholar',
    description: 'Complete 10 lessons with perfect scores',
    icon: <Brain className="w-6 h-6" />,
    category: 'learning',
    tier: 'gold',
    points: 75,
    requirement: 'Perfect 10 lessons',
    progress: 3,
    maxProgress: 10,
    unlocked: false,
    rarity: 'rare',
    reward: 'Advanced lessons unlocked'
  },
  
  // Puzzles Category
  {
    id: 'puzzle-solver',
    title: 'Puzzle Solver',
    description: 'Solve 5 tactical puzzles correctly',
    icon: <Puzzle className="w-6 h-6" />,
    category: 'puzzles',
    tier: 'bronze',
    points: 20,
    requirement: 'Solve 5 puzzles',
    progress: 5,
    maxProgress: 5,
    unlocked: true,
    unlockedAt: new Date('2024-01-12'),
    rarity: 'common',
    reward: '+20 XP'
  },
  {
    id: 'lightning-fast',
    title: 'Lightning Fast',
    description: 'Solve a puzzle in under 10 seconds',
    icon: <Zap className="w-6 h-6" />,
    category: 'puzzles',
    tier: 'silver',
    points: 30,
    requirement: 'Solve puzzle <10s',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    rarity: 'uncommon',
    reward: 'Speed puzzle mode unlocked'
  },
  {
    id: 'grandmaster-puzzle',
    title: 'Tactical Genius',
    description: 'Solve a grandmaster-level puzzle',
    icon: <Crown className="w-6 h-6" />,
    category: 'puzzles',
    tier: 'platinum',
    points: 150,
    requirement: 'Solve GM puzzle',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    rarity: 'epic',
    reward: 'Exclusive GM puzzle set'
  },
  
  // Progress Category
  {
    id: 'daily-player',
    title: 'Daily Player',
    description: 'Play chess for 7 consecutive days',
    icon: <Calendar className="w-6 h-6" />,
    category: 'progress',
    tier: 'silver',
    points: 40,
    requirement: '7 day streak',
    progress: 3,
    maxProgress: 7,
    unlocked: false,
    rarity: 'common',
    reward: 'Daily bonus unlocked'
  },
  {
    id: 'dedicated',
    title: 'Dedicated Player',
    description: 'Play chess for 30 consecutive days',
    icon: <Flame className="w-6 h-6" />,
    category: 'progress',
    tier: 'gold',
    points: 100,
    requirement: '30 day streak',
    progress: 3,
    maxProgress: 30,
    unlocked: false,
    rarity: 'rare',
    reward: 'Exclusive chess set theme'
  },
  
  // Social Category
  {
    id: 'socialite',
    title: 'Chess Socialite',
    description: 'Make friends with 5 other players',
    icon: <Users className="w-6 h-6" />,
    category: 'social',
    tier: 'bronze',
    points: 25,
    requirement: 'Add 5 friends',
    progress: 0,
    maxProgress: 5,
    unlocked: false,
    rarity: 'common',
    reward: 'Friend challenges unlocked'
  },
  
  // Special Category
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Win a game in under 2 minutes',
    icon: <Timer className="w-6 h-6" />,
    category: 'special',
    tier: 'gold',
    points: 75,
    requirement: 'Win game <2min',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    rarity: 'rare',
    reward: 'Blitz mode unlocked'
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Play a game without making any mistakes',
    icon: <Star className="w-6 h-6" />,
    category: 'special',
    tier: 'platinum',
    points: 200,
    requirement: 'Perfect game',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    rarity: 'legendary',
    reward: 'Perfect play analysis tool'
  }
];

interface AchievementCardProps {
  achievement: Achievement;
  showProgress?: boolean;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ 
  achievement, 
  showProgress = true 
}) => {
  const getTierColors = (tier: string) => {
    switch (tier) {
      case 'bronze': return {
        bg: 'from-amber-600/20 to-orange-600/20',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        glow: 'shadow-amber-500/20'
      };
      case 'silver': return {
        bg: 'from-gray-400/20 to-slate-500/20',
        border: 'border-gray-400/30',
        text: 'text-gray-300',
        glow: 'shadow-gray-400/20'
      };
      case 'gold': return {
        bg: 'from-yellow-500/20 to-yellow-600/20',
        border: 'border-yellow-500/30',
        text: 'text-yellow-400',
        glow: 'shadow-yellow-500/20'
      };
      case 'platinum': return {
        bg: 'from-cyan-400/20 to-blue-500/20',
        border: 'border-cyan-400/30',
        text: 'text-cyan-400',
        glow: 'shadow-cyan-400/20'
      };
      case 'diamond': return {
        bg: 'from-purple-500/20 to-pink-500/20',
        border: 'border-purple-500/30',
        text: 'text-purple-400',
        glow: 'shadow-purple-500/20'
      };
      default: return {
        bg: 'from-gray-500/20 to-gray-600/20',
        border: 'border-gray-500/30',
        text: 'text-gray-400',
        glow: 'shadow-gray-500/20'
      };
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Medal className="w-3 h-3" />;
      case 'uncommon': return <Award className="w-3 h-3" />;
      case 'rare': return <Star className="w-3 h-3" />;
      case 'epic': return <Crown className="w-3 h-3" />;
      case 'legendary': return <Gem className="w-3 h-3" />;
      default: return <Medal className="w-3 h-3" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'uncommon': return 'text-green-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const tierColors = getTierColors(achievement.tier);
  const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 group",
      achievement.unlocked 
        ? `bg-gradient-to-br ${tierColors.bg} ${tierColors.border} border-2 hover:shadow-lg ${tierColors.glow}`
        : "bg-surface border-border-subtle opacity-75",
      achievement.unlocked && "hover:scale-[1.02] cursor-pointer"
    )}>
      {/* Sparkle Effect for Unlocked Achievements */}
      {achievement.unlocked && (
        <div className="absolute top-2 right-2">
          <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
        </div>
      )}

      {/* Lock Overlay */}
      {!achievement.unlocked && (
        <div className="absolute top-2 right-2">
          <Lock className="w-4 h-4 text-text-muted" />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={cn(
            "p-3 rounded-lg flex items-center justify-center",
            achievement.unlocked 
              ? `${tierColors.text} bg-current/20` 
              : "text-text-muted bg-border-subtle"
          )}>
            {achievement.icon}
          </div>
          
          {/* Title and Badges */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className={cn(
                "text-base font-bold truncate",
                achievement.unlocked ? "text-text-primary" : "text-text-muted"
              )}>
                {achievement.title}
              </CardTitle>
              {achievement.unlocked && (
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
              )}
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              {/* Tier Badge */}
              <Badge className={cn(
                "text-xs font-medium capitalize",
                `${tierColors.text} bg-current/20 border-current/30`
              )}>
                {achievement.tier}
              </Badge>
              
              {/* Rarity Badge */}
              <Badge variant="outline" className="text-xs">
                <span className={getRarityColor(achievement.rarity)}>
                  {getRarityIcon(achievement.rarity)}
                </span>
                <span className="ml-1 capitalize">{achievement.rarity}</span>
              </Badge>
            </div>
            
            {/* Points */}
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400" />
              <span className="text-xs font-medium text-text-secondary">
                {achievement.points} points
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Description */}
        <p className="text-sm text-text-secondary leading-relaxed">
          {achievement.description}
        </p>
        
        {/* Progress Bar */}
        {showProgress && !achievement.unlocked && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted">Progress</span>
              <span className="font-medium text-text-secondary">
                {achievement.progress} / {achievement.maxProgress}
              </span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2"
            />
          </div>
        )}
        
        {/* Requirement */}
        <div className="text-xs text-text-muted">
          <span className="font-medium">Requirement:</span> {achievement.requirement}
        </div>
        
        {/* Reward */}
        {achievement.reward && (
          <div className="text-xs">
            <span className="font-medium text-text-secondary">Reward:</span>
            <span className="ml-1 text-accent-primary">{achievement.reward}</span>
          </div>
        )}
        
        {/* Unlocked Date */}
        {achievement.unlocked && achievement.unlockedAt && (
          <div className="text-xs text-text-muted">
            Unlocked on {achievement.unlockedAt.toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface AchievementSystemProps {
  viewMode?: 'all' | 'unlocked' | 'locked';
}

const AchievementSystem: React.FC<AchievementSystemProps> = ({ 
  viewMode = 'all' 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All', icon: <Star className="w-4 h-4" /> },
    { id: 'playing', name: 'Playing', icon: <Trophy className="w-4 h-4" /> },
    { id: 'learning', name: 'Learning', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'puzzles', name: 'Puzzles', icon: <Puzzle className="w-4 h-4" /> },
    { id: 'progress', name: 'Progress', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'social', name: 'Social', icon: <Users className="w-4 h-4" /> },
    { id: 'special', name: 'Special', icon: <Sparkles className="w-4 h-4" /> }
  ];

  const tiers = [
    { id: 'all', name: 'All Tiers' },
    { id: 'bronze', name: 'Bronze' },
    { id: 'silver', name: 'Silver' },
    { id: 'gold', name: 'Gold' },
    { id: 'platinum', name: 'Platinum' },
    { id: 'diamond', name: 'Diamond' }
  ];

  const filteredAchievements = achievements.filter(achievement => {
    if (viewMode === 'unlocked' && !achievement.unlocked) return false;
    if (viewMode === 'locked' && achievement.unlocked) return false;
    if (selectedCategory !== 'all' && achievement.category !== selectedCategory) return false;
    if (selectedTier !== 'all' && achievement.tier !== selectedTier) return false;
    return true;
  });

  const stats = {
    total: achievements.length,
    unlocked: achievements.filter(a => a.unlocked).length,
    totalPoints: achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0),
    maxPoints: achievements.reduce((sum, a) => sum + a.points, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-text-primary">
          Achievements
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          Track your chess journey and unlock rewards as you improve your skills.
        </p>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="p-4 rounded-lg bg-surface-elevated border border-border-default">
            <div className="text-2xl font-bold text-accent-primary">{stats.unlocked}</div>
            <div className="text-sm text-text-muted">Unlocked</div>
          </div>
          <div className="p-4 rounded-lg bg-surface-elevated border border-border-default">
            <div className="text-2xl font-bold text-text-primary">{stats.total}</div>
            <div className="text-sm text-text-muted">Total</div>
          </div>
          <div className="p-4 rounded-lg bg-surface-elevated border border-border-default">
            <div className="text-2xl font-bold text-yellow-400">{stats.totalPoints}</div>
            <div className="text-sm text-text-muted">Points</div>
          </div>
          <div className="p-4 rounded-lg bg-surface-elevated border border-border-default">
            <div className="text-2xl font-bold text-text-secondary">
              {Math.round((stats.unlocked / stats.total) * 100)}%
            </div>
            <div className="text-sm text-text-muted">Complete</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              {category.icon}
              {category.name}
            </Button>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {tiers.map((tier) => (
            <Button
              key={tier.id}
              variant={selectedTier === tier.id ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSelectedTier(tier.id)}
            >
              {tier.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            showProgress={true}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            No achievements found
          </h3>
          <p className="text-text-secondary">
            Try adjusting your filters to see more achievements.
          </p>
        </div>
      )}
    </div>
  );
};

export default AchievementSystem;
export { type Achievement, achievements };