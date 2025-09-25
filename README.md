# ♟️ Chess Academy V3

A modern, real-time multiplayer chess platform built with React, TypeScript, Node.js, and Socket.IO.

![Chess Academy V3](https://img.shields.io/badge/version-3.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.0-blue.svg)

## 🎯 Features

### 🎮 Live Multiplayer Chess
- **Real-time gameplay** with WebSocket connections
- **Automatic matchmaking** by skill level
- **Multiple time controls**: Bullet (1+0, 2+1), Blitz (3+0, 3+2, 5+0, 5+3), Rapid (10+0, 15+10), Classical (30+0)
- **Board orientation** for both players (white/black perspective)
- **Move validation** with chess.js engine
- **Game state synchronization** across all connected clients

### 💬 Interactive Chat System
- **Real-time messaging** during games
- **Chess-specific quick messages** for fun banter
  - "What are you thinking? 🤔"
  - "Taking so long to move your piece! ⏰"
  - "Nice move! 👍"
  - "Checkmate coming! ⚔️"
- **Emoji support** with chess-themed reactions
- **Draggable & resizable** chat window
- **Collapsible interface** to focus on the game

### 🎨 Modern UI/UX
- **Fullscreen mode** with seamless toggle (ESC key support)
- **Beautiful chess board** with piece animations
- **Dark theme** optimized for long gaming sessions
- **Responsive design** for desktop and mobile
- **Real-time timer display** with countdown animations
- **Player ratings** and profile information

### 🏗️ Technical Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + Socket.IO
- **Chess Engine**: chess.js for move validation
- **UI Components**: Custom components with Tailwind CSS
- **Real-time Communication**: WebSocket connections
- **State Management**: React hooks with optimistic updates

## 🚀 Quick Start

### Prerequisites
- Node.js 16.0.0 or higher
- npm or yarn package manager
- Modern web browser with WebSocket support

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/chess-academy-v3.git
cd chess-academy-v3
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend/frontend
npm install
```

4. **Start the development servers**

Backend (Terminal 1):
```bash
cd backend
PORT=3002 npm run dev
```

Frontend (Terminal 2):
```bash
cd frontend/frontend
npm run dev
```

5. **Open your browser**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3002

## 🏃‍♂️ How to Play

1. **Join the Lobby**: Navigate to the multiplayer section
2. **Select Time Control**: Choose from bullet, blitz, rapid, or classical
3. **Find Opponent**: Automatic matchmaking will pair you with another player
4. **Play Chess**: Make moves by clicking and dragging pieces
5. **Chat**: Use the chat system to communicate with your opponent
6. **Fullscreen**: Press the fullscreen button or F11 for immersive gameplay

## 🏗️ Project Structure

```
chess-academy-v3/
├── backend/                    # Node.js backend server
│   ├── src/
│   │   ├── services/          # WebSocket and game logic
│   │   ├── routes/           # Express API routes
│   │   └── server.ts         # Main server file
│   └── package.json
├── frontend/
│   └── frontend/              # React frontend application
│       ├── src/
│       │   ├── components/   # React components
│       │   │   ├── chess/   # Chess board components
│       │   │   ├── multiplayer/  # Multiplayer game components
│       │   │   └── ui/      # Reusable UI components
│       │   ├── utils/       # Utility functions
│       │   └── App.tsx      # Main application component
│       └── package.json
├── docs/                      # Documentation files
├── test-fullstack.sh         # Development testing script
└── README.md                 # This file
```

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start           # Start production server
```

### Frontend Development
```bash
cd frontend/frontend
npm run dev         # Start Vite development server
npm run build       # Build for production
npm run preview     # Preview production build
```

### Full-Stack Testing
```bash
./test-fullstack.sh  # Test both frontend and backend
```

## 🎯 Key Components

### ImprovedLiveChessGame
- Main game interface with real-time board updates
- Handles player moves, chat system, and game state
- Supports fullscreen mode and responsive design
- File: `/frontend/frontend/src/components/multiplayer/ImprovedLiveChessGame.tsx`

### SimpleMultiplayerLobby  
- Matchmaking interface with time control selection
- Real-time connection status and player authentication
- File: `/frontend/frontend/src/components/multiplayer/SimpleMultiplayerLobby.tsx`

### WebSocket Service
- Handles all real-time communication
- Manages game rooms and player matching
- File: `/backend/src/services/simpleWebsocket.ts`

## 🌟 Recent Updates (V3.0)

### ✅ Fixed Issues
- **Chat Attribution**: Messages now show correct usernames and colors
- **Board Orientation**: Each player sees correct piece colors
- **Fullscreen UX**: Added visible exit button and ESC key support
- **Connection Stability**: Fixed disconnection issues during game creation

### ✨ New Features  
- **Chess Quick Messages**: 12 pre-written chess-specific messages
- **Advanced Chat UI**: Draggable, resizable, collapsible chat window
- **Better Visual Feedback**: Improved animations and transitions
- **Enhanced Matchmaking**: More stable player pairing system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [chess.js](https://github.com/jhlywa/chess.js) - Chess game logic
- [Socket.IO](https://socket.io/) - Real-time communication
- [React](https://reactjs.org/) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework

## 🔗 Links

- **Demo**: [Live Demo](https://studyify.in/chess) (Coming Soon)
- **Documentation**: [Full Docs](./docs/)
- **Issues**: [Report Issues](https://github.com/yourusername/chess-academy-v3/issues)
- **Discussions**: [Community](https://github.com/yourusername/chess-academy-v3/discussions)

---

**Built with ❤️ for chess enthusiasts worldwide**