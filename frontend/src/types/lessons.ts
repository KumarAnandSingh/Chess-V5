// Lesson and course types

import { ChessPuzzle, ChessMove, ChessPosition } from './chess';

export type LessonType = 'theory' | 'puzzle' | 'practice' | 'quiz' | 'story';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type LessonStatus = 'locked' | 'available' | 'current' | 'completed';

export interface LessonContent {
  id: string;
  type: LessonType;
  title: string;
  content: string;
  position?: ChessPosition;
  moves?: ChessMove[];
  puzzle?: ChessPuzzle;
  questions?: QuizQuestion[];
  media?: MediaContent[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'move-input';
  options?: string[];
  correctAnswer: string | ChessMove;
  explanation: string;
  points: number;
}

export interface MediaContent {
  type: 'image' | 'video' | 'animation';
  url: string;
  caption?: string;
  duration?: number; // For videos/animations
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  estimatedDuration: number; // minutes
  xpReward: number;
  prerequisites: string[]; // lesson IDs
  content: LessonContent[];
  objectives: string[];
  keywords: string[];
  order: number;
  isUnlocked: boolean;
  status: LessonStatus;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  totalLessons: number;
  completedLessons: number;
  totalXP: number;
  estimatedHours: number;
  lessons: Lesson[];
  order: number;
  icon: string;
  color: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
  totalLessons: number;
  totalXP: number;
  estimatedHours: number;
  difficulty: DifficultyLevel;
}

// Learning progress types
export interface LessonProgress {
  lessonId: string;
  userId: string;
  status: LessonStatus;
  completedAt?: Date;
  attempts: number;
  bestScore: number;
  timeSpent: number; // seconds
  hintsUsed: number;
  mistakes: number;
  xpEarned: number;
}

export interface ModuleProgress {
  moduleId: string;
  userId: string;
  completedLessons: number;
  totalXP: number;
  averageScore: number;
  timeSpent: number;
  startedAt: Date;
  completedAt?: Date;
  lessonProgress: LessonProgress[];
}

export interface LearningPath {
  id: string;
  userId: string;
  currentLessonId?: string;
  completedLessons: string[];
  totalXP: number;
  currentLevel: number;
  streak: number;
  longestStreak: number;
  lastActivity: Date;
  preferences: LearningPreferences;
}

export interface LearningPreferences {
  difficulty: DifficultyLevel;
  lessonTypes: LessonType[];
  dailyGoalMinutes: number;
  reminderEnabled: boolean;
  reminderTime: string; // HH:MM format
  soundEnabled: boolean;
  animationsEnabled: boolean;
  hintsEnabled: boolean;
  autoAdvance: boolean;
}