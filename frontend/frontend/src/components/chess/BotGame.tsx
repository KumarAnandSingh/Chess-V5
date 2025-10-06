/**
 * Bot Game Component - Play against AI opponents
 * Integrates with custom training engine for different difficulty levels
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { getChessEngine, type BotLevel, type EngineMove } from '../../services/chessEngine';

interface BotGameProps {
  onGameEnd?: (result: 'win' | 'loss' | 'draw', pgn: string) => void;
  initialLevel?: number;
}

const BotGame: React.FC<BotGameProps> = ({ onGameEnd, initialLevel = 5 }) => {
  const [game, setGame] = useState(new Chess());
  const [gamePosition, setGamePosition] = useState(game.fen());
  const [botLevel, setBotLevel] = useState(initialLevel);
  const [isThinking, setIsThinking] = useState(false);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [lastBotMove, setLastBotMove] = useState<EngineMove | null>(null);
  
  const chessEngine = getChessEngine();
  const botLevels = chessEngine.getBotLevels();
  const currentBot = chessEngine.getBotConfig(botLevel);

  // Make bot move
  const makeBotMove = useCallback(async () => {
    if (game.isGameOver() || isThinking) return;
    
    setIsThinking(true);
    try {
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
            result = game.turn() === 'w' ? 'loss' : 'win'; // Bot just moved, so if white to move, bot won
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
    }
  }, [game, botLevel, isThinking, onGameEnd, chessEngine]);

  // Handle user moves
  const handleMove = useCallback((sourceSquare: string, targetSquare: string) => {
    if (isThinking || game.isGameOver()) return false;

    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // Always promote to queen for simplicity
      });

      if (move) {
        setGame(new Chess(game.fen()));
        setGamePosition(game.fen());
        setMoveHistory(prev => [...prev, move.san]);

        // Check if game is over after user move
        if (game.isGameOver()) {
          let result: 'win' | 'loss' | 'draw';
          if (game.isCheckmate()) {
            result = 'win'; // User just moved and checkmated bot
          } else {
            result = 'draw';
          }
          setGameResult(game.isCheckmate() ? 'You win!' : 'Draw!');
          onGameEnd?.(result, game.pgn());
          return true;
        }

        // Make bot move after short delay
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

  // Change bot level
  const changeBotLevel = (newLevel: number) => {
    setBotLevel(newLevel);
    resetGame();
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      {/* Bot Selection */}
      <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-2">Choose Your Opponent</h3>
        <select
          value={botLevel}
          onChange={(e) => changeBotLevel(parseInt(e.target.value))}
          className="w-full p-2 border rounded-md"
          disabled={isThinking}
        >
          {botLevels.map((bot) => (
            <option key={bot.level} value={bot.level}>
              Level {bot.level}: {bot.name} ({bot.elo} ELO)
            </option>
          ))}
        </select>
        {currentBot && (
          <p className="text-sm text-gray-600 mt-2">{currentBot.personality}</p>
        )}
      </div>

      {/* Game Status */}
      <div className="bg-blue-50 rounded-lg p-4 w-full max-w-md text-center">
        {isThinking && (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-blue-600">Bot is thinking...</span>
          </div>
        )}
        {gameResult && (
          <div className="text-lg font-semibold text-green-600">{gameResult}</div>
        )}
        {!isThinking && !gameResult && (
          <div className="text-gray-700">
            {game.turn() === 'w' ? 'Your turn (White)' : 'Your turn (Black)'}
          </div>
        )}
      </div>

      {/* Chess Board */}
      <div className="w-full max-w-lg">
        <Chessboard
          options={{
            position: gamePosition,
            onPieceDrop: ({ sourceSquare, targetSquare }: any) => handleMove(sourceSquare, targetSquare),
            allowDragging: !(isThinking || !!gameResult),
            boardOrientation: "white",
            boardStyle: {
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            },
          }}
        />
      </div>

      {/* Enhanced Game Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
        {/* Captured Pieces */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <span className="text-purple-600">🏆</span>
            Captured Pieces
          </h4>
          <div className="space-y-3">
            {/* Player Captures */}
            <CapturedPieces
              pieces={capturedPieces.player}
              color="black"
              title="Your Captures"
              className="mb-0"
            />
            {/* Bot Captures */}
            <CapturedPieces
              pieces={capturedPieces.bot}
              color="white"
              title={`${currentBot?.name || 'Bot'} Captures`}
              className="mb-0"
            />
            {/* Material Balance */}
            {(capturedPieces.player.length > 0 || capturedPieces.bot.length > 0) && (
              <div className="pt-2 border-t border-gray-200">
                {(() => {
                  const pieceValues: Record<string, number> = {
                    'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0
                  };
                  const playerValue = capturedPieces.player.reduce((sum, piece) => sum + (pieceValues[piece] || 0), 0);
                  const botValue = capturedPieces.bot.reduce((sum, piece) => sum + (pieceValues[piece] || 0), 0);
                  const advantage = playerValue - botValue;
                  return (
                    <div className="text-center">
                      <div className="text-xs font-medium text-gray-600 mb-1">Material Balance</div>
                      <div className={`text-sm font-bold ${
                        advantage > 0 ? 'text-blue-600' :
                        advantage < 0 ? 'text-orange-600' :
                        'text-gray-600'
                      }`}>
                        {advantage === 0 ? 'Even' :
                         advantage > 0 ? `+${advantage} You` :
                         `+${Math.abs(advantage)} Bot`
                        }
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Move History */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="font-semibold text-sm mb-2">Move History</h4>
          <div className="text-sm max-h-32 overflow-y-auto">
            {moveHistory.length === 0 ? (
              <span className="text-gray-500">No moves yet</span>
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
        </div>

        {/* Last Bot Analysis */}
        {lastBotMove && (
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-semibold text-sm mb-2">Bot Analysis</h4>
            <div className="text-sm space-y-1">
              <div>Move: <strong>{lastBotMove.move}</strong></div>
              <div>Eval: <strong>{lastBotMove.evaluation.toFixed(2)}</strong></div>
              <div>Depth: <strong>{lastBotMove.depth}</strong></div>
              <div>Time: <strong>{lastBotMove.time}ms</strong></div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <div className="flex items-center gap-2">
          <button className="h-9 px-3 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1.5">
            <Lightbulb className="h-4 w-4" />
            Hint
          </button>
          <button className="h-9 px-3 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1.5">
            <Undo2 className="h-4 w-4" />
            Undo
          </button>
          <button className="h-9 px-3 rounded-md border border-red-300 bg-white hover:bg-red-50 text-red-600 hover:text-red-700 font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1.5">
            <Flag className="h-4 w-4" />
            Resign
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        <div className="flex items-center gap-2">
          <button
            onClick={resetGame}
            className="h-9 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          >
            New Game
          </button>
          {gameResult && (
            <button
              onClick={() => {
                // TODO: Integrate with analysis system
                console.log('Analyze game:', game.pgn());
              }}
              className="h-9 px-3 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Analyze Game
            </button>
          )}
          <button className="h-9 px-3 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Back to Lessons
          </button>
        </div>
      </div>
    </div>
  );
};

export default BotGame;