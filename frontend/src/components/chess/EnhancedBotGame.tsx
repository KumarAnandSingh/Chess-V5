import React, { useState, useCallback, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Brain, Trophy, XCircle, Minus } from 'lucide-react';
import { getChessEngine, type BotLevel, type EngineMove } from '../../services/chessEngine';
import { botPersonalities, type BotPersonality } from './BotPersonalityCards';
import { colors, shadows, borderRadius, botThemes } from '../../lib/design-tokens';

interface EnhancedBotGameProps {
  selectedBotId?: string;
  onGameEnd?: (result: 'win' | 'loss' | 'draw', pgn: string) => void;
  initialLevel?: number;
}

const EnhancedBotGame: React.FC<EnhancedBotGameProps> = ({
  selectedBotId = 'mentor',
  onGameEnd,
  initialLevel = 5
}) => {
  const [game, setGame] = useState(new Chess());
  const [gamePosition, setGamePosition] = useState(game.fen());
  const [botLevel, setBotLevel] = useState(initialLevel);
  const [isThinking, setIsThinking] = useState(false);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [lastBotMove, setLastBotMove] = useState<EngineMove | null>(null);
  const [thinkingMessage, setThinkingMessage] = useState('');

  const chessEngine = getChessEngine();
  const botLevels = chessEngine.getBotLevels();
  const currentBot = chessEngine.getBotConfig(botLevel);

  // Get bot personality
  const botPersonality = botPersonalities.find(bot => bot.id === selectedBotId) || botPersonalities[0];
  const botTheme = botThemes[selectedBotId as keyof typeof botThemes] || botThemes.mentor;

  // Personality-based thinking messages
  const getPersonalityThinkingMessage = () => {
    const messages = {
      mentor: [
        "Let me think about this position carefully...",
        "Considering the best educational move...",
        "What would help you learn here?",
        "Analyzing the position fundamentals..."
      ],
      tactical: [
        "Looking for tactical shots!",
        "Calculating combinations...",
        "Is there a tactic here?",
        "Scanning for weaknesses..."
      ],
      positional: [
        "Evaluating pawn structure...",
        "Building long-term advantages...",
        "Improving piece coordination...",
        "Strengthening my position..."
      ],
      aggressive: [
        "Time to attack!",
        "Looking for forcing moves...",
        "Where's the weakness?",
        "Preparing the assault..."
      ],
      grandmaster: [
        "Calculating deeply...",
        "Considering all variations...",
        "Analyzing the position...",
        "Finding the best move..."
      ],
      puzzle: [
        "This looks like a puzzle...",
        "What's the pattern here?",
        "Solving the position...",
        "Finding the key move..."
      ]
    };

    const personalityMessages = messages[selectedBotId as keyof typeof messages] || messages.mentor;
    return personalityMessages[Math.floor(Math.random() * personalityMessages.length)];
  };

  // Make bot move with personality
  const makeBotMove = useCallback(async () => {
    if (game.isGameOver() || isThinking) return;

    setIsThinking(true);
    const personalityMessage = getPersonalityThinkingMessage();
    setThinkingMessage(`${botPersonality.name}: ${personalityMessage}`);

    try {
      // Add thinking time based on bot personality
      let thinkingTime = 1000;
      if (selectedBotId === 'tactical') thinkingTime = 800; // Quick tactical
      if (selectedBotId === 'positional') thinkingTime = 2000; // Slow positional
      if (selectedBotId === 'grandmaster') thinkingTime = 3000; // Deep thinking

      await new Promise(resolve => setTimeout(resolve, thinkingTime));

      const engineMove = await chessEngine.getBotMove(game.fen(), botLevel);

      const move = game.move(engineMove.move);
      if (move) {
        setGame(new Chess(game.fen()));
        setGamePosition(game.fen());
        setMoveHistory(prev => [...prev, move.san]);
        setLastBotMove(engineMove);

        // Check for game end
        if (game.isGameOver()) {
          let result: 'win' | 'loss' | 'draw';
          if (game.isCheckmate()) {
            result = game.turn() === 'w' ? 'loss' : 'win';
          } else {
            result = 'draw';
          }
          setGameResult(game.isCheckmate() ? (game.turn() === 'w' ? 'Bot wins!' : 'You win!') : 'Draw!');
          onGameEnd?.(result, game.pgn());
        }
      }
    } catch (error) {
      console.error('Bot move error:', error);
    } finally {
      setIsThinking(false);
      setThinkingMessage('');
    }
  }, [game, botLevel, isThinking, onGameEnd, chessEngine, selectedBotId, botPersonality.name]);

  // Handle user moves
  const handleMove = useCallback((sourceSquare: string, targetSquare: string) => {
    if (isThinking || game.isGameOver()) return false;

    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      });

      if (move) {
        setGame(new Chess(game.fen()));
        setGamePosition(game.fen());
        setMoveHistory(prev => [...prev, move.san]);

        // Check if game is over after user move
        if (game.isGameOver()) {
          let result: 'win' | 'loss' | 'draw';
          if (game.isCheckmate()) {
            result = 'win';
          } else {
            result = 'draw';
          }
          setGameResult(game.isCheckmate() ? 'You win!' : 'Draw!');
          onGameEnd?.(result, game.pgn());
          return true;
        }

        // Make bot move after delay
        setTimeout(() => makeBotMove(), 500);
        return true;
      }
    } catch (error) {
      console.error('Move error:', error);
    }
    return false;
  }, [game, isThinking, makeBotMove, onGameEnd]);

  // Reset game
  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setGamePosition(newGame.fen());
    setGameResult(null);
    setMoveHistory([]);
    setLastBotMove(null);
    setIsThinking(false);
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      {/* Bot Personality Header */}
      <Card
        className="w-full max-w-md"
        style={{
          backgroundColor: `${botTheme.primary}10`,
          borderColor: botTheme.primary,
          borderWidth: '2px',
          borderRadius: borderRadius.lg,
          boxShadow: shadows.md
        }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            {botPersonality.avatar}
            <div className="flex-1">
              <CardTitle
                className="text-lg"
                style={{ color: botTheme.primary }}
              >
                {botPersonality.name}
              </CardTitle>
              <p
                className="text-sm font-medium"
                style={{ color: botTheme.secondary }}
              >
                {botPersonality.title}
              </p>
              <Badge
                className="text-xs mt-1"
                style={{
                  backgroundColor: `${botTheme.primary}20`,
                  color: botTheme.secondary,
                  borderRadius: borderRadius.full
                }}
              >
                {botPersonality.difficulty} • {botPersonality.rating} ELO
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p
            className="text-sm"
            style={{ color: colors.neutral[600] }}
          >
            {botPersonality.personality}
          </p>
        </CardContent>
      </Card>

      {/* Game Status */}
      <Card className="w-full max-w-md">
        <CardContent className="p-4 text-center">
          {isThinking && (
            <div className="flex items-center justify-center space-x-2">
              <div
                className="animate-spin rounded-full h-4 w-4 border-b-2"
                style={{ borderColor: botTheme.primary }}
              ></div>
              <span style={{ color: botTheme.primary }}>
                {thinkingMessage}
              </span>
            </div>
          )}
          {gameResult && (
            <div
              className="text-lg font-semibold"
              style={{ color: colors.success[600] }}
            >
              {gameResult}
            </div>
          )}
          {!isThinking && !gameResult && (
            <div style={{ color: colors.neutral[700] }}>
              {game.turn() === 'w' ? 'Your turn (White)' : 'Your turn (Black)'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chess Board */}
      <div className="w-full max-w-lg">
        <Chessboard
          options={{
            position: gamePosition,
            onPieceDrop: ({ sourceSquare, targetSquare }: any) => handleMove(sourceSquare, targetSquare),
            allowDragging: !(isThinking || !!gameResult),
            boardOrientation: "white",
            boardStyle: {
              borderRadius: borderRadius.lg,
              boxShadow: shadows.md
            },
          }}
        />
      </div>

      {/* Move History & Bot Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
        {/* Move History */}
        <Card style={{ borderRadius: borderRadius.lg }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Move History</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-sm max-h-32 overflow-y-auto">
              {moveHistory.length === 0 ? (
                <span style={{ color: colors.neutral[500] }}>No moves yet</span>
              ) : (
                moveHistory.map((move, index) => (
                  <span key={index} className="mr-2">
                    {Math.floor(index / 2) + 1}
                    {index % 2 === 0 ? '. ' : '... '}
                    {move}
                  </span>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bot Analysis */}
        {lastBotMove && (
          <Card style={{ borderRadius: borderRadius.lg }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1">
                <Brain className="h-3 w-3" />
                {botPersonality.name} Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm space-y-1">
                <div>Move: <strong>{lastBotMove.move}</strong></div>
                <div>Eval: <strong>{lastBotMove.evaluation.toFixed(2)}</strong></div>
                <div>Depth: <strong>{lastBotMove.depth}</strong></div>
                <div>Time: <strong>{lastBotMove.time}ms</strong></div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Game Controls */}
      <div className="flex space-x-2">
        <Button
          onClick={resetGame}
          style={{
            backgroundColor: colors.neutral[600],
            color: colors.neutral[0],
            borderRadius: borderRadius.md
          }}
        >
          New Game
        </Button>
        {gameResult && (
          <Button
            onClick={() => {
              console.log('Analyze game:', game.pgn());
            }}
            style={{
              backgroundColor: botTheme.primary,
              color: colors.neutral[0],
              borderRadius: borderRadius.md
            }}
          >
            Analyze Game
          </Button>
        )}
      </div>

      {/* Game Result Display */}
      {gameResult && (
        <Card
          className="w-full max-w-md"
          style={{
            backgroundColor: gameResult.includes('win') ? colors.success[50] :
                           gameResult.includes('Draw') ? colors.warning[50] : colors.error[50],
            borderColor: gameResult.includes('win') ? colors.success[500] :
                        gameResult.includes('Draw') ? colors.warning[500] : colors.error[500],
            borderWidth: '1px',
            borderRadius: borderRadius.lg
          }}
        >
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-2">
              {gameResult.includes('win') ? (
                <Trophy className="h-8 w-8" style={{ color: colors.warning[500] }} />
              ) : gameResult.includes('Draw') ? (
                <Minus className="h-8 w-8" style={{ color: colors.neutral[500] }} />
              ) : (
                <XCircle className="h-8 w-8" style={{ color: colors.error[500] }} />
              )}
            </div>
            <h3 className="text-lg font-bold mb-2">{gameResult}</h3>
            <div className="flex gap-2 justify-center">
              <Button onClick={resetGame} size="sm">
                New Game
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedBotGame;