# Chess Academy v5 🏆

A comprehensive chess learning platform with advanced performance tracking and professional-grade analytics.

![Chess Academy v5](https://img.shields.io/badge/version-5.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D20.19.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.1.1-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.8-blue.svg)

## ✨ Features

### 🎯 Performance Tracking System
- **Performance Index (PI)**: 0-100 scale with detailed analytics
- **Star Ratings**: 0-3 stars based on game performance
- **Move Analysis**: Real-time evaluation of Inaccuracies, Mistakes, and Blunders
- **Session Progress**: Guest-friendly tracking without authentication
- **Boss Levels**: Special challenges with enhanced difficulty

### ♟️ Professional Chess Interface
- **Player Avatars**: Profile display with ratings and captured pieces
- **Move List Panel**: Opening names and algebraic notation
- **Captured Pieces**: Horizontal display with Unicode chess symbols
- **Action Controls**: Functional Hint, Undo, and Resign buttons
- **Clean UI**: Professional chess.com-style design

### 🎮 Game Features
- **20 Progressive Levels**: Structured difficulty progression
- **AI Bot Opponents**: Multiple personalities and playing styles
- **Real-time Analysis**: Move quality feedback during play
- **Post-game Analytics**: Detailed performance breakdown
- **Toast Notifications**: Aid usage warnings and star caps

## 🚀 Quick Start

### Prerequisites
- Node.js v20.19+
- npm v10+

### Installation
```bash
# Clone the repository
git clone https://github.com/KumarAnandSingh/Chess-V5.git
cd Chess-V5/frontend/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access
Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📊 Performance System

### Performance Index Calculation
```
PI = 0.5×Result + 0.2×Quality + 0.2×Efficiency + 0.1×Time - Penalties
```

#### Components:
- **Result Score**: Win=100, Draw=60, Loss=0
- **Quality Score**: Based on move accuracy (I/M/B penalties)
- **Efficiency Score**: Move count vs par comparison
- **Time Score**: Average seconds per move evaluation
- **Penalties**: Aid usage deductions (15×hints + 10×undos)

### Star Rating System
- **3★**: Win + PI≥85 + No hints used
- **2★**: Win + PI≥65
- **1★**: (Win OR Draw) + PI≥50
- **Aid Penalties**: Regular levels max 2★, Boss levels max 1★

### Move Quality Thresholds
- **Inaccuracy**: Centipawn loss ≥40 and <80
- **Mistake**: Centipawn loss ≥80 and <150
- **Blunder**: Centipawn loss ≥150

## 🎯 Level System

### Standard Levels (1-20)
- Progressive difficulty with varying par moves
- Full aid availability (hints and undos)
- Standard star rating system

### Boss Levels (5, 10, 15)
- Enhanced difficulty challenges
- Stricter star caps when aids are used
- Special achievement recognition

## 🏗️ Architecture

### Core Components
```
src/
├── hooks/
│   └── usePerformanceTracking.ts    # Main tracking system
├── config/
│   └── levelConfig.ts               # Level configurations
├── components/
│   ├── chess/
│   │   ├── PlayVsComputer.tsx       # Main game component
│   │   ├── PlayerAvatar.tsx         # Player profiles
│   │   ├── MoveListPanel.tsx        # Move history
│   │   └── PerformanceAnalysisModal.tsx # Post-game analysis
│   └── ui/
│       └── ToastNotification.tsx    # Aid usage notifications
└── styles/
    └── design-tokens.css            # Design system
```

### Data Flow
1. **Game Start**: Initialize with level configuration
2. **Move Recording**: Real-time analysis and tracking
3. **Aid Usage**: Toast notifications and penalty tracking
4. **Game End**: PI calculation and star rating
5. **Session Storage**: Progress persistence until refresh

## 📱 Usage

### Starting a Game
1. Navigate to "Play with Bot"
2. Select difficulty level (1-20)
3. Choose bot personality
4. Begin playing with real-time tracking

### Understanding Performance
- **Green moves**: Excellent/Good play
- **Yellow moves**: Inaccuracies (minor errors)
- **Orange moves**: Mistakes (significant errors)
- **Red moves**: Blunders (major errors)

### Using Aids
- **Hint**: Shows suggested move (15 point penalty)
- **Undo**: Reverts last move (10 point penalty)
- **Toast warnings**: Immediate feedback on star cap impact

### Post-Game Analysis
- **Performance Summary**: PI score and star rating
- **Move Breakdown**: Quality analysis with timing
- **Key Moments**: Critical position highlights
- **Improvement Areas**: Specific feedback for growth

## 🔧 Development

### Scripts
```bash
npm run dev      # Start development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Code linting
npm run test     # Run test suite
```

### Project Structure
- **Frontend**: React + TypeScript + Vite
- **Chess Engine**: Stockfish.js integration
- **UI Framework**: shadcn/ui components
- **Styling**: Tailwind CSS with design tokens
- **State Management**: Zustand stores

### Performance Tracking Implementation
```typescript
// Start game with level configuration
const { startGame } = usePerformanceTracking();
const gameId = startGame(levelId);

// Record move analysis
const { recordMove } = usePerformanceTracking();
await recordMove(move, evalBefore, evalAfter, timeSpent);

// Handle aid usage
const { recordHint } = usePerformanceTracking();
recordHint(); // Triggers toast notification

// End game with results
const { endGame } = usePerformanceTracking();
const gameData = endGame(result, pgnString);
```

## 📚 Documentation

- **[Performance Tracking Guide](./frontend/frontend/PERFORMANCE_TRACKING.md)**: Complete system documentation
- **[Changelog](./CHANGELOG.md)**: Version history and updates
- **[Level Configuration](./frontend/frontend/src/config/levelConfig.ts)**: Level settings and boss mechanics

## 🎯 Quality Assurance

### Validated Features
- ✅ Exact PI calculation matching specifications
- ✅ Star rating system with aid penalties
- ✅ Boss level mechanics and restrictions
- ✅ Toast notifications for aid usage
- ✅ Session-based progress tracking
- ✅ Professional UI matching reference designs

### Test Coverage
- Performance calculation accuracy (±1 tolerance)
- Star rating edge cases and aid penalties
- Level progression and boss mechanics
- UI responsiveness and accessibility
- Cross-browser compatibility

## 🏆 Achievements

- **Complete Performance System**: Professional chess analytics
- **Session-Based Tracking**: No authentication required
- **Progressive Difficulty**: 20 structured levels with boss challenges
- **Professional UI**: Chess.com-style interface
- **Real-time Feedback**: Move quality analysis during play
- **Comprehensive Analytics**: Detailed post-game insights

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For questions or support, please open an issue on GitHub or contact the development team.

---

**Chess Academy v5** - Master the game with professional-grade analytics and tracking! 🚀