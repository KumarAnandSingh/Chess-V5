import React, { useState } from 'react';
import { usePerformanceTracking } from '../../hooks/usePerformanceTracking';
import { ToastNotification, useToast } from '../ui/ToastNotification';
import { getLevelConfig } from '../../config/levelConfig';

export const PerformanceTrackingExample: React.FC = () => {
  const {
    currentGame,
    startGame,
    recordMove,
    recordHint,
    recordUndo,
    endGame,
    isCurrentLevelBoss,
    getLevelConfig: getConfig
  } = usePerformanceTracking();

  const { toast, showHintToast, showUndoToast, hideToast } = useToast();
  const [gameResult, setGameResult] = useState<any>(null);

  const handleStartLevel = (levelId: number) => {
    const gameId = startGame(levelId);
    console.log(`Started level ${levelId} with game ID: ${gameId}`);
  };

  const handleMove = async () => {
    if (!currentGame) return;

    // Simulate a move with some evaluation data
    await recordMove(
      'Nf3', // Move in algebraic notation
      0.2,   // Evaluation before move (in pawns)
      0.15,  // Evaluation after move
      2.5    // Time spent in seconds
    );

    console.log('Move recorded');
  };

  const handleHint = () => {
    if (!currentGame) return;

    recordHint();
    const isBoss = isCurrentLevelBoss();
    showHintToast(isBoss);
    console.log(`Hint used. Boss level: ${isBoss}`);
  };

  const handleUndo = () => {
    if (!currentGame) return;

    recordUndo();
    const isBoss = isCurrentLevelBoss();
    showUndoToast(isBoss);
    console.log(`Undo used. Boss level: ${isBoss}`);
  };

  const handleEndGame = (result: 'win' | 'draw' | 'loss') => {
    if (!currentGame) return;

    const pgn = "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6"; // Example PGN
    const gameData = endGame(result, pgn);
    setGameResult(gameData);

    console.log('Game ended:', gameData);
  };

  const currentLevelConfig = currentGame ? getConfig(currentGame.levelId || 1) : null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Performance Tracking Demo</h1>

      {/* Level Selection */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Start a Game</h2>
        <div className="flex flex-wrap gap-2">
          {[1, 5, 10, 14, 15].map(levelId => {
            const config = getLevelConfig(levelId);
            return (
              <button
                key={levelId}
                onClick={() => handleStartLevel(levelId)}
                className={`px-4 py-2 rounded ${
                  config.boss
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Level {levelId} {config.boss ? '(Boss)' : ''} - Par: {config.parMoves}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Game Status */}
      {currentGame && (
        <div className="mb-8 p-4 bg-green-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Current Game</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Level:</span> {currentGame.levelId}
              {currentLevelConfig?.boss && <span className="ml-1 text-red-600 font-bold">(Boss)</span>}
            </div>
            <div><span className="font-medium">Par Moves:</span> {currentGame.parMoves}</div>
            <div><span className="font-medium">Your Moves:</span> {currentGame.yourMoves || 0}</div>
            <div><span className="font-medium">Errors:</span> I={currentGame.I || 0}, M={currentGame.M || 0}, B={currentGame.B || 0}</div>
            <div><span className="font-medium">Hints Used:</span> {currentGame.hintsUsed || 0}</div>
            <div><span className="font-medium">Undos Used:</span> {currentGame.undosUsed || 0}</div>
            <div><span className="font-medium">Move Times:</span> {(currentGame.moveTimesMs || []).length}</div>
            <div><span className="font-medium">Analysis Depth:</span> {currentLevelConfig?.analysis.depth || 12}</div>
          </div>
        </div>
      )}

      {/* Game Actions */}
      {currentGame && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Game Actions</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleMove}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Simulate Move
            </button>
            <button
              onClick={handleHint}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              Use Hint
            </button>
            <button
              onClick={handleUndo}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              Use Undo
            </button>
            <button
              onClick={() => handleEndGame('win')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Win Game
            </button>
            <button
              onClick={() => handleEndGame('draw')}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Draw Game
            </button>
            <button
              onClick={() => handleEndGame('loss')}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Lose Game
            </button>
          </div>
        </div>
      )}

      {/* Game Result */}
      {gameResult && (
        <div className="mb-8 p-4 bg-indigo-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Last Game Result</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div><span className="font-medium">Level:</span> {gameResult.levelId}</div>
            <div><span className="font-medium">Result:</span> {gameResult.result}</div>
            <div><span className="font-medium">PI:</span> {gameResult.PI}</div>
            <div><span className="font-medium">Stars:</span> {gameResult.stars}★</div>
            <div><span className="font-medium">Your Moves:</span> {gameResult.yourMoves}</div>
            <div><span className="font-medium">Par Moves:</span> {gameResult.parMoves}</div>
            <div><span className="font-medium">Avg Time/Move:</span> {gameResult.avgSecPerMove?.toFixed(1)}s</div>
            <div><span className="font-medium">Errors:</span> I={gameResult.I}, M={gameResult.M}, B={gameResult.B}</div>
            <div><span className="font-medium">Aids Used:</span> H={gameResult.hintsUsed}, U={gameResult.undosUsed}</div>
          </div>

          {/* Show exact output format */}
          <div className="mt-4">
            <h3 className="font-medium mb-2">JSON Output:</h3>
            <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-auto">
{JSON.stringify({
  userId: gameResult.userId,
  levelId: gameResult.levelId,
  result: gameResult.result,
  stars: gameResult.stars,
  PI: gameResult.PI,
  yourMoves: gameResult.yourMoves,
  parMoves: gameResult.parMoves,
  avgSecPerMove: gameResult.avgSecPerMove,
  I: gameResult.I,
  M: gameResult.M,
  B: gameResult.B,
  hintsUsed: gameResult.hintsUsed,
  undosUsed: gameResult.undosUsed,
  pgn: gameResult.pgn,
  moveTimesMs: gameResult.moveTimesMs,
  completedAt: gameResult.completedAt
}, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Level Configuration Reference */}
      <div className="mb-8 p-4 bg-yellow-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Implementation Notes</h2>
        <div className="space-y-2 text-sm">
          <div><span className="font-medium">Analysis Thresholds:</span> I≥40cp, M≥80cp, B≥150cp</div>
          <div><span className="font-medium">Analysis Depth:</span> 12 (configurable per level)</div>
          <div><span className="font-medium">Star Caps:</span> Regular levels with aids: 2★, Boss levels with aids: 1★</div>
          <div><span className="font-medium">Time Scoring:</span> 100 at ≤8s, linear 100→50 from 8s→20s, scaled 50→30 for >20s</div>
          <div><span className="font-medium">PI Formula:</span> 0.5×Result + 0.2×Quality + 0.2×Efficiency + 0.1×Time - Penalties</div>
        </div>
      </div>

      {/* Toast Notification */}
      <ToastNotification
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={4000}
      />
    </div>
  );
};