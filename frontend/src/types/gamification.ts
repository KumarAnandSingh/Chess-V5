// Gamification system types

export type AchievementType = 'lesson' | 'puzzle' | 'streak' | 'skill' | 'social' | 'milestone';
export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: AchievementType;
  rarity: AchievementRarity;
  icon: string;
  xpReward: number;
  requirements: AchievementRequirement[];
  unlockedAt?: Date;
  progress: number; // 0-100 percentage
}

export interface AchievementRequirement {
  type: 'lesson_complete' | 'puzzle_solve' | 'streak_reach' | 'rating_achieve' | 'time_spend';
  target: number;
  current: number;
  metadata?: Record<string, any>;
}

export interface UserAchievement {
  achievementId: string;
  userId: string;
  unlockedAt: Date;
  xpEarned: number;
  notificationSeen: boolean;
}

// XP and Level System
export interface XPTransaction {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  source: 'lesson' | 'puzzle' | 'achievement' | 'streak' | 'bonus';
  sourceId: string;
  timestamp: Date;
}

export interface UserLevel {
  level: number;
  title: string;
  xpRequired: number;
  xpToNext: number;
  perks: string[];
  icon: string;
  color: string;
}

export interface UserStats {
  userId: string;
  totalXP: number;
  currentLevel: number;
  levelProgress: number; // 0-100 percentage to next level
  lessonsCompleted: number;
  puzzlesSolved: number;
  currentStreak: number;
  longestStreak: number;
  totalTimeSpent: number; // minutes
  averageAccuracy: number;
  favoriteOpenings: string[];
  strongestTactics: string[];
  weakestAreas: string[];
  rating: number;
  rank: number;
  lastActivity: Date;
}

// Streak System
export interface StreakData {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  streakFreezesUsed: number;
  streakFreezesAvailable: number;
  milestones: StreakMilestone[];
}

export interface StreakMilestone {
  days: number;
  title: string;
  reward: StreakReward;
  achieved: boolean;
  achievedAt?: Date;
}

export interface StreakReward {
  type: 'xp' | 'badge' | 'freeze' | 'cosmetic';
  amount: number;
  item?: string;
}

// Leaderboard System
export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar: string;
  score: number;
  rank: number;
  trend: 'up' | 'down' | 'same';
  isCurrentUser: boolean;
}

export interface Leaderboard {
  type: 'xp' | 'streak' | 'lessons' | 'puzzles' | 'rating';
  period: 'daily' | 'weekly' | 'monthly' | 'all-time';
  entries: LeaderboardEntry[];
  userRank?: number;
  totalParticipants: number;
  lastUpdated: Date;
}

// Challenge System
export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special';
  difficulty: 'easy' | 'medium' | 'hard';
  requirements: ChallengeRequirement[];
  rewards: ChallengeReward[];
  startDate: Date;
  endDate: Date;
  participants: number;
  completions: number;
}

export interface ChallengeRequirement {
  type: 'lesson_complete' | 'puzzle_solve' | 'time_limit' | 'accuracy' | 'streak';
  target: number;
  description: string;
}

export interface ChallengeReward {
  type: 'xp' | 'achievement' | 'cosmetic' | 'badge';
  amount?: number;
  item?: string;
}

export interface UserChallenge {
  challengeId: string;
  userId: string;
  progress: number; // 0-100 percentage
  completed: boolean;
  completedAt?: Date;
  attempts: number;
  startedAt: Date;
}

// Social Features
export interface UserProfile {
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  level: number;
  rating: number;
  joinedAt: Date;
  lastSeen: Date;
  stats: UserStats;
  achievements: UserAchievement[];
  preferences: {
    profileVisibility: 'public' | 'friends' | 'private';
    showRating: boolean;
    showStats: boolean;
    allowFriendRequests: boolean;
  };
}

export interface Friendship {
  id: string;
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: Date;
  acceptedAt?: Date;
}