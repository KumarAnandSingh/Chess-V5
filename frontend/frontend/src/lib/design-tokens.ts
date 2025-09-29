/**
 * Design System Tokens for Chess Academy
 * Centralized color, typography, and spacing tokens
 */

// Color System
export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Main primary
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },

  // Success Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Main success
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Warning Colors
  warning: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308', // Main warning
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
  },

  // Error Colors
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // Main error
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Neutral Colors (for text, borders, backgrounds)
  neutral: {
    0: '#ffffff',
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },

  // Chess-specific colors
  chess: {
    light: '#f0d9b5',
    dark: '#b58863',
    highlight: '#fffacd',
    lastMove: '#cdd26a',
    check: '#ff6b6b',
    selected: '#20b2aa',
  }
} as const;

// Bot Personality Theme Colors
export const botThemes = {
  mentor: {
    primary: colors.primary[500],
    secondary: colors.primary[700],
    accent: colors.primary[400],
    gradient: 'from-blue-500/20 to-blue-600/20'
  },
  tactical: {
    primary: colors.warning[500],
    secondary: colors.warning[700],
    accent: colors.warning[300],
    gradient: 'from-yellow-500/20 to-orange-600/20'
  },
  positional: {
    primary: colors.success[500],
    secondary: colors.success[700],
    accent: colors.success[400],
    gradient: 'from-green-500/20 to-emerald-600/20'
  },
  aggressive: {
    primary: colors.error[500],
    secondary: colors.error[700],
    accent: colors.error[400],
    gradient: 'from-red-500/20 to-red-600/20'
  },
  grandmaster: {
    primary: '#8b5cf6',
    secondary: '#7c3aed',
    accent: '#a78bfa',
    gradient: 'from-purple-500/20 to-purple-600/20'
  },
  puzzle: {
    primary: '#14b8a6',
    secondary: '#0f766e',
    accent: '#5eead4',
    gradient: 'from-teal-500/20 to-cyan-600/20'
  }
} as const;

// Typography Scale
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Menlo', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  }
} as const;

// Spacing Scale
export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
} as const;

// Border Radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  DEFAULT: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
} as const;

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
} as const;

// Animation Durations
export const animation = {
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },
  timing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  }
} as const;

// Difficulty Level Colors
export const difficultyColors = {
  beginner: {
    bg: colors.success[100],
    text: colors.success[800],
    border: colors.success[300],
  },
  intermediate: {
    bg: colors.warning[100],
    text: colors.warning[800],
    border: colors.warning[300],
  },
  advanced: {
    bg: '#fed7aa', // orange-200
    text: '#c2410c', // orange-700
    border: '#fdba74', // orange-300
  },
  expert: {
    bg: colors.error[100],
    text: colors.error[800],
    border: colors.error[300],
  },
  master: {
    bg: '#e9d5ff', // purple-200
    text: '#7c2d12', // purple-900
    border: '#c4b5fd', // purple-300
  },
} as const;

// Helper functions
export const getColorValue = (colorPath: string): string => {
  const keys = colorPath.split('.');
  let value: any = { colors };

  for (const key of keys) {
    value = value[key];
    if (value === undefined) {
      console.warn(`Color path "${colorPath}" not found in design tokens`);
      return colors.neutral[500]; // Fallback color
    }
  }

  return value;
};

export const getBotTheme = (botType: keyof typeof botThemes) => {
  return botThemes[botType] || botThemes.mentor;
};

export const getDifficultyColor = (difficulty: keyof typeof difficultyColors) => {
  return difficultyColors[difficulty] || difficultyColors.beginner;
};