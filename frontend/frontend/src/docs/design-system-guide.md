# Chess Academy Design System Guide

## Overview

This guide documents the comprehensive design system for Chess Academy, inspired by Chess.com's professional design quality while maintaining our unique identity. The system emphasizes accessibility, consistency, and user engagement through sophisticated visual design.

## Design Philosophy

### Core Principles

1. **Professional Excellence**: Match industry-leading platforms like Chess.com
2. **User-Centered Design**: Prioritize usability and accessibility
3. **Visual Hierarchy**: Clear information organization and content prioritization
4. **Consistent Patterns**: Unified design language across all components
5. **Engaging Experience**: Rich animations and interactive feedback

### Design Values

- **Accessibility First**: WCAG AA compliance with excellent contrast ratios
- **Performance Optimized**: Efficient animations and optimized asset loading
- **Mobile Responsive**: Seamless experience across all device sizes
- **Scalable Architecture**: Modular design tokens and component library

## Color System

### Chess.com Inspired Palette

#### Primary Colors
```css
--color-accent-primary: #769656;    /* Chess green */
--color-accent-secondary: #CC9543;  /* Chess gold */
--color-accent-blue: #58A6FF;       /* Interactive blue */
```

#### Dark Theme (Primary)
```css
--color-bg-base: #0D1117;           /* Deep dark background */
--color-surface: #21262D;           /* Card surfaces */
--color-surface-elevated: #2D333B;  /* Elevated elements */
--color-text-primary: #F0F6FC;      /* High contrast text */
--color-text-secondary: #7D8590;    /* Secondary text */
```

#### Semantic Colors
```css
--color-success: #3FB950;           /* Success states */
--color-warning: #D29922;           /* Warning states */
--color-danger: #F85149;            /* Error states */
--color-info: #58A6FF;              /* Information states */
```

### Color Usage Guidelines

1. **Primary Actions**: Use `--color-accent-primary` for main CTAs
2. **Secondary Actions**: Use `--color-accent-secondary` for secondary CTAs
3. **Interactive Elements**: Use `--color-accent-blue` for links and interactive states
4. **Semantic Feedback**: Use semantic colors for status indicators

## Typography

### Font System

#### Font Families
```css
--font-primary: 'Inter';      /* Primary UI font */
--font-secondary: 'Manrope';  /* Secondary/display font */
--font-mono: 'SF Mono';       /* Code and data font */
```

#### Type Scale
```css
--text-xs: 0.75rem;     /* 12px - Small labels */
--text-sm: 0.875rem;    /* 14px - Secondary text */
--text-base: 1rem;      /* 16px - Body text */
--text-lg: 1.125rem;    /* 18px - Large body */
--text-xl: 1.25rem;     /* 20px - Subtitles */
--text-2xl: 1.5rem;     /* 24px - H3 headings */
--text-3xl: 1.875rem;   /* 30px - H2 headings */
--text-4xl: 2.25rem;    /* 36px - H1 headings */
--text-5xl: 3rem;       /* 48px - Display text */
--text-6xl: 3.75rem;    /* 60px - Hero text */
```

#### Font Weights
```css
--font-weight-normal: 400;    /* Regular text */
--font-weight-medium: 500;    /* Emphasis */
--font-weight-semibold: 600;  /* Strong emphasis */
--font-weight-bold: 700;      /* Headings */
--font-weight-extrabold: 800; /* Hero text */
```

### Typography Guidelines

1. **Headings**: Use bold weights (700-800) with tight tracking
2. **Body Text**: Use normal weight (400) with relaxed line height
3. **UI Elements**: Use medium weight (500-600) for better readability
4. **Data/Numbers**: Use mono font for alignment and clarity

## Spacing System

### 8px Grid System
```css
--space-1: 4px;    /* xs */
--space-2: 8px;    /* sm */
--space-3: 12px;   /* md */
--space-4: 16px;   /* lg */
--space-6: 24px;   /* xl */
--space-8: 32px;   /* 2xl */
--space-12: 48px;  /* 3xl */
--space-16: 64px;  /* 4xl */
--space-20: 80px;  /* 5xl */
--space-24: 96px;  /* 6xl */
```

### Spacing Guidelines

1. **Component Padding**: Use consistent spacing tokens
2. **Layout Margins**: Follow 8px baseline grid
3. **Touch Targets**: Minimum 44px for mobile accessibility
4. **Content Spacing**: Use logical spacing progression

## Component Library

### Cards

#### Enhanced Dashboard Cards
- **Glass morphism effect** with backdrop blur
- **Hover animations** with scale and glow effects
- **Progressive enhancement** with feature badges
- **Consistent padding** and border radius

```tsx
<Card className="glass-card hover:scale-[1.02] transition-all duration-300">
  {/* Card content */}
</Card>
```

#### Progress Cards
- **Animated progress bars** with shimmer effects
- **Color-coded metrics** for different data types
- **Icon integration** for visual context
- **Responsive design** for mobile and desktop

### Buttons

#### Primary Actions
```css
.btn-primary {
  background: linear-gradient(135deg, var(--color-cta-primary), var(--color-cta-primary-hover));
  box-shadow: var(--elevation-card);
  transition: all var(--transition-fast);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: var(--elevation-elevated);
}
```

#### Button Sizes
```css
--button-xs-height: 28px;   /* Extra small */
--button-sm-height: 32px;   /* Small */
--button-md-height: 40px;   /* Medium (default) */
--button-lg-height: 48px;   /* Large */
--button-xl-height: 56px;   /* Extra large */
```

### Navigation

#### Enhanced Sidebar
- **Collapsible design** with smooth animations
- **Active state indicators** with border accents
- **Badge system** for notifications and status
- **Progressive disclosure** of secondary information

#### Navigation Items
- **Icon-based design** with clear visual hierarchy
- **Hover states** with color transitions
- **Badge integration** for live updates
- **Responsive behavior** for mobile and desktop

### Chess-Specific Components

#### Bot Personality Cards
- **Unique avatars** for each AI opponent
- **Tier-based styling** (Bronze, Silver, Gold, Platinum, Diamond)
- **Specialty badges** for different play styles
- **Unlock system** with rating requirements

#### Achievement System
- **Rarity-based design** (Common to Legendary)
- **Progress tracking** with animated bars
- **Category filtering** for organization
- **Unlock animations** for engagement

### Chess Board Enhancements

#### Professional Styling
```css
--color-board-light: #EBECD0;  /* Light squares */
--color-board-dark: #739552;   /* Dark squares */
--color-board-highlight: rgba(255, 255, 0, 0.6);
--color-board-legal-move: rgba(63, 185, 80, 0.4);
--color-board-capture: rgba(248, 81, 73, 0.6);
```

#### Interactive States
- **Hover effects** on pieces with scale and shadow
- **Drag animations** with rotation and elevation
- **Move highlighting** with smooth transitions
- **Last move indicators** with fade animations

## Animation System

### Motion Principles

1. **Purposeful**: Animations should serve a functional purpose
2. **Consistent**: Use standardized timing and easing curves
3. **Performant**: Optimize for 60fps on all devices
4. **Accessible**: Respect `prefers-reduced-motion` settings

### Timing and Easing

```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-medium: 300ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-bounce: 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Key Animations

#### Micro-interactions
- **Button hover**: Scale, shadow, and color changes
- **Card hover**: Elevation and border color changes
- **Icon hover**: Scale and rotation effects

#### Page Transitions
- **Slide up**: For modal and drawer appearances
- **Fade in**: For content loading states
- **Scale in**: For emphasis and attention

#### Chess-specific
- **Piece movement**: Smooth positioning with physics
- **Capture animations**: Emphasis with scale and fade
- **Check indicators**: Pulsing and color animations

## Elevation System

### Shadow Levels
```css
--elevation-subtle: 0 1px 3px rgba(1, 4, 9, 0.12);
--elevation-card: 0 3px 12px rgba(1, 4, 9, 0.18);
--elevation-elevated: 0 6px 20px rgba(1, 4, 9, 0.25);
--elevation-dropdown: 0 12px 28px rgba(1, 4, 9, 0.35);
--elevation-modal: 0 16px 40px rgba(1, 4, 9, 0.45);
```

### Glow Effects
```css
--glow-accent-primary: 0 0 20px rgba(118, 150, 86, 0.3);
--glow-accent-secondary: 0 0 20px rgba(204, 149, 67, 0.3);
--glow-success: 0 0 20px rgba(63, 185, 80, 0.3);
--glow-danger: 0 0 20px rgba(248, 81, 73, 0.3);
```

## Accessibility Guidelines

### Focus Management
- **Visible focus indicators** with high contrast
- **Logical tab order** throughout the interface
- **Focus trapping** in modals and dialogs

### Color Contrast
- **Minimum 4.5:1** for normal text (WCAG AA)
- **Minimum 3:1** for large text and UI components
- **High contrast mode** support for enhanced accessibility

### Screen Reader Support
- **Semantic HTML** with proper heading hierarchy
- **ARIA labels** for complex interactive elements
- **Alternative text** for all meaningful images

### Keyboard Navigation
- **Full keyboard access** for all interactive elements
- **Shortcut keys** for common actions
- **Skip links** for efficient navigation

## Responsive Design

### Breakpoint System
```css
--breakpoint-xs: 475px;   /* Small phones */
--breakpoint-sm: 640px;   /* Large phones */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small laptops */
--breakpoint-xl: 1280px;  /* Large laptops */
--breakpoint-2xl: 1536px; /* Desktops */
```

### Mobile-First Approach
1. **Start with mobile** design and scale up
2. **Touch-friendly** targets with minimum 44px
3. **Readable text** without zooming
4. **Optimized images** for different screen densities

### Desktop Enhancements
1. **Hover states** for interactive feedback
2. **Larger click targets** for precision
3. **Advanced layouts** with multiple columns
4. **Keyboard shortcuts** for power users

## Implementation Guidelines

### Development Workflow

1. **Design Tokens First**: Use CSS custom properties
2. **Component-Based**: Build reusable UI components
3. **Progressive Enhancement**: Start with core functionality
4. **Performance Monitoring**: Regular performance audits

### Code Organization

```
src/
├── styles/
│   ├── design-tokens.css     # Core design system
│   └── animations.css        # Animation utilities
├── components/
│   ├── ui/                   # Base UI components
│   ├── chess/               # Chess-specific components
│   └── gamification/        # Achievement system
└── docs/
    └── design-system-guide.md
```

### Best Practices

1. **Consistent Naming**: Use semantic class names
2. **Component Composition**: Build complex UIs from simple components
3. **Performance**: Optimize for mobile and low-end devices
4. **Testing**: Regular accessibility and usability testing

## Future Enhancements

### Planned Improvements

1. **Dark/Light Theme Toggle**: Complete dual-theme support
2. **Advanced Animations**: More sophisticated micro-interactions
3. **Accessibility Enhancements**: Voice navigation support
4. **Performance Optimizations**: Reduce bundle size and improve loading

### Component Roadmap

1. **Tournament Interfaces**: Event cards and bracket displays
2. **Social Features**: Friend lists and chat interfaces
3. **Analysis Tools**: Game review and position evaluation
4. **Learning Modules**: Interactive lesson components

---

*This design system is continuously evolving based on user feedback and industry best practices. Regular updates ensure we maintain the highest standards of design quality and user experience.*