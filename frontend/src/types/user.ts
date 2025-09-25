// User authentication and profile types

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  preferences: UserPreferences;
  subscription?: Subscription;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  boardTheme: 'classic' | 'wood' | 'marble' | 'neon';
  pieceSet: 'classic' | 'modern' | 'medieval' | 'staunton';
  soundEnabled: boolean;
  musicEnabled: boolean;
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  privacySettings: {
    profileVisible: boolean;
    statsVisible: boolean;
    allowFriendRequests: boolean;
    showOnlineStatus: boolean;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  username: string;
  displayName: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  newsletterOptIn?: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileUpdate {
  displayName?: string;
  avatar?: File;
  bio?: string;
  preferences?: Partial<UserPreferences>;
}

// Subscription and billing types
export type SubscriptionTier = 'free' | 'premium' | 'pro';
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'unpaid';

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  features: SubscriptionFeatures;
}

export interface SubscriptionFeatures {
  maxLessonsPerDay: number;
  maxPuzzlesPerDay: number;
  advancedAnalysis: boolean;
  aiCoaching: boolean;
  offlineMode: boolean;
  prioritySupport: boolean;
  customThemes: boolean;
  detailedStats: boolean;
  friendsChallenges: boolean;
}

// Session and security types
export interface Session {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  lastUsedAt: Date;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  backupCodes: string[];
  trustedDevices: TrustedDevice[];
  loginHistory: LoginAttempt[];
}

export interface TrustedDevice {
  id: string;
  name: string;
  lastUsed: Date;
  ipAddress: string;
  userAgent: string;
}

export interface LoginAttempt {
  id: string;
  success: boolean;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  failureReason?: string;
}