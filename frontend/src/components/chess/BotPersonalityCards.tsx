import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Brain,
  Zap,
  Shield,
  Sword,
  Crown,
  Target,
  BookOpen,
  Puzzle,
  TrendingUp,
  Star,
  Timer,
  Award
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { colors, botThemes, getDifficultyColor, shadows, borderRadius } from '../../lib/design-tokens';

interface BotPersonality {
  id: string;
  name: string;
  title: string;
  description: string;
  personality: string;
  rating: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master';
  specialties: string[];
  playstyle: string;
  avatar: React.ReactNode;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    gradient: string;
  };
  stats: {
    games_played: number;
    win_rate: number;
    avg_game_time: string;
  };
  unlocked: boolean;
  featured?: boolean;
}

const botPersonalities: BotPersonality[] = [
  {
    id: 'mentor',
    name: 'Professor Magnus',
    title: 'The Patient Teacher',
    description: 'A gentle mentor who explains every move and helps you understand chess principles.',
    personality: 'Patient, encouraging, and educational. Focuses on teaching rather than just winning.',
    rating: 1200,
    difficulty: 'Beginner',
    specialties: ['Opening Principles', 'Endgame Basics', 'Tactical Patterns'],
    playstyle: 'Educational & Supportive',
    avatar: (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
        <BookOpen className="w-6 h-6 text-white" />
      </div>
    ),
    theme: botThemes.mentor,
    stats: {
      games_played: 15420,
      win_rate: 65,
      avg_game_time: '15 min'
    },
    unlocked: true,
    featured: true
  },
  {
    id: 'tactical',
    name: 'Lightning Strike',
    title: 'The Tactical Genius',
    description: 'A sharp tactical player who loves combinations and quick strikes.',
    personality: 'Aggressive, quick-thinking, and loves complex tactical positions.',
    rating: 1600,
    difficulty: 'Intermediate',
    specialties: ['Tactical Combinations', 'Quick Attacks', 'Pin & Fork Patterns'],
    playstyle: 'Aggressive Tactical',
    avatar: (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
        <Zap className="w-6 h-6 text-white" />
      </div>
    ),
    theme: botThemes.tactical,
    stats: {
      games_played: 8750,
      win_rate: 72,
      avg_game_time: '8 min'
    },
    unlocked: true
  },
  {
    id: 'positional',
    name: 'Fortress Builder',
    title: 'The Strategic Master',
    description: 'A positional player who builds strong structures and controls the board.',
    personality: 'Calm, methodical, and focuses on long-term strategic advantages.',
    rating: 1800,
    difficulty: 'Advanced',
    specialties: ['Positional Play', 'Pawn Structures', 'Piece Coordination'],
    playstyle: 'Strategic & Positional',
    avatar: (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
        <Shield className="w-6 h-6 text-white" />
      </div>
    ),
    theme: botThemes.positional,
    stats: {
      games_played: 12300,
      win_rate: 78,
      avg_game_time: '25 min'
    },
    unlocked: true
  },
  {
    id: 'aggressive',
    name: 'Blade Runner',
    title: 'The Attacking Force',
    description: 'An ultra-aggressive player who sacrifices material for devastating attacks.',
    personality: 'Bold, fearless, and always looking for the knockout blow.',
    rating: 2000,
    difficulty: 'Expert',
    specialties: ['Sacrificial Attacks', 'King Hunts', 'Dynamic Play'],
    playstyle: 'Ultra Aggressive',
    avatar: (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
        <Sword className="w-6 h-6 text-white" />
      </div>
    ),
    theme: botThemes.aggressive,
    stats: {
      games_played: 6890,
      win_rate: 81,
      avg_game_time: '12 min'
    },
    unlocked: false
  },
  {
    id: 'grandmaster',
    name: 'Immortal Mind',
    title: 'The Chess Sage',
    description: 'A world-class AI that plays at grandmaster level with perfect technique.',
    personality: 'Flawless, calculating, and demonstrates the highest level of chess understanding.',
    rating: 2400,
    difficulty: 'Master',
    specialties: ['Perfect Technique', 'Deep Calculation', 'All Phases'],
    playstyle: 'Grandmaster Level',
    avatar: (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
        <Crown className="w-6 h-6 text-white" />
      </div>
    ),
    theme: botThemes.grandmaster,
    stats: {
      games_played: 3250,
      win_rate: 92,
      avg_game_time: '35 min'
    },
    unlocked: false
  },
  {
    id: 'puzzle',
    name: 'Puzzle Master',
    title: 'The Problem Solver',
    description: 'Specializes in tactical puzzles and finding the best moves in complex positions.',
    personality: 'Analytical, precise, and loves solving chess puzzles and tactical problems.',
    rating: 1700,
    difficulty: 'Advanced',
    specialties: ['Tactical Puzzles', 'Complex Positions', 'Pattern Recognition'],
    playstyle: 'Puzzle Focused',
    avatar: (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
        <Puzzle className="w-6 h-6 text-white" />
      </div>
    ),
    theme: botThemes.puzzle,
    stats: {
      games_played: 9840,
      win_rate: 75,
      avg_game_time: '18 min'
    },
    unlocked: true
  }
];

interface BotPersonalityCardProps {
  bot: BotPersonality;
  onPlayClick: (botId: string) => void;
  onLearnMoreClick: (botId: string) => void;
}

const BotPersonalityCard: React.FC<BotPersonalityCardProps> = ({ 
  bot, 
  onPlayClick, 
  onLearnMoreClick 
}) => {
  const getDifficultyColorClasses = (difficulty: string) => {
    const difficultyKey = difficulty.toLowerCase() as keyof typeof getDifficultyColor;
    const colorConfig = getDifficultyColor(difficultyKey);
    return {
      backgroundColor: colorConfig.bg,
      color: colorConfig.text,
      borderColor: colorConfig.border
    };
  };

  return (
    <Card className={cn(
      "group relative h-full overflow-hidden transition-all duration-300",
      "hover:scale-[1.02] hover:shadow-2xl",
      bot.unlocked 
        ? "cursor-pointer bg-surface-elevated border-border-default" 
        : "opacity-75 bg-surface border-border-subtle",
      bot.featured && "ring-2 ring-accent-primary/30 shadow-lg"
    )}>
      {/* Background Gradient */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        `bg-gradient-to-br ${bot.theme.gradient}`
      )} />
      
      {/* Featured Badge */}
      {bot.featured && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-accent-primary/20 text-accent-primary border-accent-primary/30">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        </div>
      )}

      {/* Lock Overlay for Locked Bots */}
      {!bot.unlocked && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center p-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2"
              style={{ backgroundColor: colors.neutral[200] }}
            >
              <Crown className="w-6 h-6" style={{ color: colors.neutral[500] }} />
            </div>
            <p className="text-sm font-medium" style={{ color: colors.neutral[600] }}>Reach {bot.rating} rating to unlock</p>
          </div>
        </div>
      )}

      <CardHeader className="relative z-20 pb-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative">
            {bot.avatar}
            {bot.unlocked && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-surface-elevated flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            )}
          </div>
          
          {/* Title Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg font-bold text-text-primary truncate">
                {bot.name}
              </CardTitle>
              <Badge
                className="text-xs font-medium border"
                style={getDifficultyColorClasses(bot.difficulty)}
              >
                {bot.difficulty}
              </Badge>
            </div>
            <CardDescription className="text-sm font-medium" style={{ color: bot.theme.primary }}>
              {bot.title}
            </CardDescription>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3 text-text-muted" />
                <span className="text-xs font-bold text-text-secondary">{bot.rating}</span>
              </div>
              <div className="w-1 h-1 bg-border-default rounded-full" />
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-success" />
                <span className="text-xs font-medium text-success">{bot.stats.win_rate}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-20 space-y-4">
        {/* Description */}
        <p className="text-sm text-text-secondary leading-relaxed">
          {bot.description}
        </p>

        {/* Playstyle */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
            Playstyle
          </h4>
          <Badge variant="outline" className="text-xs">
            {bot.playstyle}
          </Badge>
        </div>

        {/* Specialties */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
            Specialties
          </h4>
          <div className="flex flex-wrap gap-1">
            {bot.specialties.map((specialty, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-surface border-border-subtle"
              >
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border-subtle">
          <div className="text-center">
            <div className="text-sm font-bold text-text-primary">{bot.stats.games_played.toLocaleString()}</div>
            <div className="text-xs text-text-muted">Games</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold" style={{ color: bot.theme.primary }}>{bot.stats.win_rate}%</div>
            <div className="text-xs text-text-muted">Win Rate</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-text-primary">{bot.stats.avg_game_time}</div>
            <div className="text-xs text-text-muted">Avg Time</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="relative z-20 pt-4 space-y-2">
        <Button
          onClick={() => onPlayClick(bot.id)}
          disabled={!bot.unlocked}
          className={cn(
            "w-full font-semibold transition-all duration-200",
            bot.unlocked 
              ? "bg-gradient-to-r text-white hover:scale-105 hover:shadow-lg" 
              : "opacity-50 cursor-not-allowed"
          )}
          style={bot.unlocked ? {
            background: `linear-gradient(135deg, ${bot.theme.primary} 0%, ${bot.theme.secondary} 100%)`
          } : {}}
        >
          {bot.unlocked ? 'Play Now' : 'Locked'}
        </Button>
        
        {bot.unlocked && (
          <Button
            onClick={() => onLearnMoreClick(bot.id)}
            variant="outline"
            size="sm"
            className="w-full text-xs"
          >
            Learn More
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

interface BotPersonalityCardsProps {
  onPlayClick?: (botId: string) => void;
  onLearnMoreClick?: (botId: string) => void;
  showUnlocked?: boolean;
}

const BotPersonalityCards: React.FC<BotPersonalityCardsProps> = ({
  onPlayClick = () => {},
  onLearnMoreClick = () => {},
  showUnlocked = true
}) => {
  const filteredBots = showUnlocked 
    ? botPersonalities 
    : botPersonalities.filter(bot => bot.unlocked);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-text-primary">
          Choose Your Opponent
        </h2>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          Each AI opponent has a unique personality and playing style. 
          Find the perfect challenge for your skill level.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBots.map((bot) => (
          <BotPersonalityCard
            key={bot.id}
            bot={bot}
            onPlayClick={onPlayClick}
            onLearnMoreClick={onLearnMoreClick}
          />
        ))}
      </div>

      {/* Unlock Message */}
      {showUnlocked && (
        <div className="text-center p-6 rounded-lg bg-surface-elevated border border-border-default">
          <Award className="w-8 h-8 text-accent-secondary mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Unlock More Opponents
          </h3>
          <p className="text-text-secondary">
            Improve your rating to unlock stronger opponents with unique personalities and challenges.
          </p>
        </div>
      )}
    </div>
  );
};

export default BotPersonalityCards;
export { type BotPersonality, botPersonalities };