# Chess Academy v5 - Changelog

## [v1.4.0] - 2025-09-26 - Performance Tracking System

### 🚀 Major Features Added

#### Performance Tracking System
- **Performance Index (PI)**: 0-100 scale calculation with exact formula implementation
- **Star Rating System**: 0-3 stars based on performance with aid usage penalties
- **Move Analysis**: Real-time centipawn loss analysis (Inaccuracies, Mistakes, Blunders)
- **Session-Based Progress**: Guest user tracking with unique IDs and sessionStorage
- **Level Configuration**: Structured levels with boss mechanics and aid restrictions

#### Enhanced Chess Interface
- **Player Avatars**: Professional profile display with ratings and captured pieces
- **Captured Pieces Display**: Horizontal layout next to player profiles with Unicode symbols
- **Move List Panel**: Right sidebar with opening names and algebraic notation
- **Action Button Improvements**: Fully functional Hint, Undo, Resign buttons
- **Toast Notifications**: Aid usage warnings with star cap indicators

#### UI/UX Improvements
- **Clean Interface**: Removed debug text, login/signup CTAs, theme toggles
- **Light Theme Only**: Consistent design with proper contrast ratios
- **Professional Layout**: Chess.com-style interface matching reference designs
- **Responsive Design**: Mobile and desktop optimized layouts

### 📊 Performance Calculation Details

#### Performance Index Formula
```
PI = 0.5×ResultScore + 0.2×QualityScore + 0.2×EfficiencyScore + 0.1×TimeScore - Penalties
```

#### Component Breakdown
- **Result Score**: Win=100, Draw=60, Loss=0, Abort=0
- **Quality Score**: `max(0, 100 - (B×25 + M×10 + I×5))`
- **Efficiency Score**: `clamp(round(100 × (parMoves/yourMoves)^0.5), 30, 100)`
- **Time Score**: 100 (≤8s), linear 100→50 (8-20s), scaled 50→30 (>20s)
- **Penalties**: 15×hints + 10×undos

#### Star Rating Rules
- **3★**: Win AND PI≥85 AND hints=0
- **2★**: Win AND PI≥65
- **1★**: (Win OR Draw) AND PI≥50
- **Aid Caps**: Regular levels max 2★, Boss levels max 1★ when aids used

### 🎮 Level System

#### Level Configuration
- **20 Levels**: Progressive difficulty with varying par moves
- **Boss Levels**: 5, 10, 15 with special mechanics
- **Aid Restrictions**: Configurable hint/undo availability
- **Analysis Settings**: Depth 12, thresholds I≥40, M≥80, B≥150

### 🔧 Technical Implementation

#### New Files Created
- `src/hooks/usePerformanceTracking.ts` - Core tracking system
- `src/config/levelConfig.ts` - Level configuration
- `src/components/chess/PlayerAvatar.tsx` - Player profiles
- `src/components/chess/MoveListPanel.tsx` - Move history
- `src/components/chess/PerformanceAnalysisModal.tsx` - Post-game analysis
- `src/components/ui/ToastNotification.tsx` - Notifications

#### Files Updated
- `src/components/chess/PlayVsComputer.tsx` - Main game integration
- `src/components/chess/ChessBoard.tsx` - Board interface cleanup
- `src/components/layout/Header.tsx` - UI cleanup
- `src/components/layout/Sidebar.tsx` - Navigation improvements
- `src/styles/design-tokens.css` - Light theme optimization

### 📈 Data Schema

#### Game Performance Data
```typescript
{
  userId: string,
  levelId: number,
  result: "win" | "draw" | "loss" | "aborted",
  stars: number,
  PI: number,
  yourMoves: number,
  parMoves: number,
  avgSecPerMove: number,
  I: number, M: number, B: number,
  hintsUsed: number, undosUsed: number,
  pgn: string,
  moveTimesMs: number[],
  completedAt: string
}
```

### ✅ Quality Assurance

#### Validation Testing
- **Sanity Check**: Level 14 calculation verified (PI=85, Stars=2★)
- **Edge Cases**: Division by zero, extreme times, abort handling
- **Aid Usage**: Toast notifications and star cap enforcement
- **Boss Levels**: Special star restrictions when aids used

#### Performance Benefits
- **Real-time Analysis**: Move quality feedback during play
- **Progress Tracking**: Session-based improvement monitoring
- **Skill Assessment**: Standardized performance metrics
- **Learning Tool**: Detailed post-game analytics

### 🎯 Key Achievements

1. **Complete Performance System**: Full implementation matching professional chess platforms
2. **Professional UI**: Chess.com-style interface with captured pieces and move lists
3. **Session Management**: Guest-friendly tracking without authentication
4. **Exact Formula Implementation**: Verified calculations with provided specifications
5. **Comprehensive Documentation**: Complete technical and user documentation

### 🔄 Migration Notes

- **Session Storage**: Data persists within browser session only
- **Guest IDs**: Unique per session, regenerated on refresh
- **Backward Compatibility**: Legacy interfaces maintained for existing components
- **No Breaking Changes**: All existing functionality preserved

---

## [v1.3.0] - 2025-09-25 - UI/UX Enhancements

### 🎨 Design System Updates
- **shadcn/ui Integration**: Complete component library adoption
- **Design Token System**: Centralized styling with CSS variables
- **Component Refactoring**: Modular architecture implementation
- **Mobile Responsiveness**: Touch-optimized interactions

### 🔧 Technical Improvements
- **Node.js Compatibility**: Updated for v20.19+ support
- **Build Optimization**: Vite configuration improvements
- **TypeScript Enhancement**: Strict type checking implementation
- **Performance Optimization**: Bundle size reduction

---

## [v1.2.0] - 2025-09-24 - Chess Engine Integration

### ♟️ Chess Functionality
- **Bot Personality System**: Multiple AI opponents with themes
- **Enhanced Gameplay**: Improved move validation and game state management
- **Stockfish Integration**: Professional chess engine implementation
- **Game Analysis**: Position evaluation and move suggestions

---

## [v1.1.0] - 2025-09-23 - Core Features

### 🏗️ Foundation
- **React + TypeScript**: Modern web application framework
- **Component Architecture**: Reusable and maintainable code structure
- **State Management**: Zustand for efficient state handling
- **Routing System**: React Router for navigation

### 🎮 Basic Chess Implementation
- **Chess Board**: Interactive chess board with piece movement
- **Game Logic**: Complete chess rules implementation
- **Player vs Computer**: Basic AI opponent functionality
- **Learning Modules**: Educational chess content structure

---

## [v1.0.0] - 2025-09-22 - Initial Release

### 🚀 Project Bootstrap
- **Project Setup**: Vite + React + TypeScript configuration
- **Basic Routing**: Homepage and navigation structure
- **UI Foundation**: Initial component library setup
- **Development Environment**: Local development server configuration