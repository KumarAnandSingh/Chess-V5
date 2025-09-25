import React, { useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { useMultiplayerStore } from '../../stores/multiplayerStore';
import { socketManager } from '../../services/socketManager';
import GameTimer from './GameTimer';
import GameChat from './GameChat';
import PlayerInfoCard from './PlayerInfoCard';

interface LiveChessBoardProps {
  gameId: string;
}

const LiveChessBoard: React.FC<LiveChessBoardProps> = ({ gameId }) => {
  const { currentGame } = useMultiplayerStore();
  const [chess] = useState(new Chess());
  const [gamePosition, setGamePosition] = useState(chess.fen());
  const [moveSquares, setMoveSquares] = useState<{ [square: string]: { background: string } }>({});
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  // Sync game state with chess instance
  useEffect(() => {
    if (currentGame.gameState?.position) {
      chess.load(currentGame.gameState.position);
      setGamePosition(currentGame.gameState.position);
      
      // Highlight last move
      if (currentGame.gameState.moves.length > 0) {
        const lastMoveStr = currentGame.gameState.moves[currentGame.gameState.moves.length - 1];
        try {
          const tempChess = new Chess();
          if (currentGame.gameState.moves.length > 1) {
            const previousMoves = currentGame.gameState.moves.slice(0, -1);
            previousMoves.forEach(move => tempChess.move(move));
          }
          const moveObj = tempChess.move(lastMoveStr);
          if (moveObj) {
            setLastMove({ from: moveObj.from, to: moveObj.to });
          }
        } catch (e) {
          console.warn('Could not parse last move for highlighting:', e);
        }
      }
    }
  }, [currentGame.gameState?.position, currentGame.gameState?.moves, chess]);

  const makeMove = useCallback((sourceSquare: string, targetSquare: string, piece: string) => {
    // Only allow moves if it's the player's turn and they're not spectating
    if (currentGame.isSpectating) return false;
    if (!currentGame.gameState || !currentGame.playerColor) return false;
    
    const isPlayerTurn = 
      (currentGame.gameState.turn === 'white' && currentGame.playerColor === 'white') ||
      (currentGame.gameState.turn === 'black' && currentGame.playerColor === 'black');
    
    if (!isPlayerTurn) return false;

    try {
      // Test the move locally first
      const gameCopy = new Chess(chess.fen());
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // Always promote to queen for simplicity
      });

      if (move) {
        // Send move to server
        const timeLeft = currentGame.playerColor === 'white' 
          ? currentGame.gameState.whiteTime 
          : currentGame.gameState.blackTime;
          
        socketManager.makeMove(gameId, {
          from: sourceSquare,
          to: targetSquare,
          promotion: move.promotion || undefined
        }, timeLeft);

        // Optimistically update local state
        chess.move(move);
        setGamePosition(chess.fen());
        setLastMove({ from: sourceSquare, to: targetSquare });
        
        return true;
      }
    } catch (error) {
      console.error('Invalid move:', error);
    }
    
    return false;
  }, [chess, currentGame, gameId]);

  const onPieceDrop = (sourceSquare: string, targetSquare: string, piece: string) => {
    return makeMove(sourceSquare, targetSquare, piece);
  };

  // Custom square styles
  const customSquareStyles = {
    ...moveSquares,
    ...(lastMove ? {
      [lastMove.from]: { background: 'rgba(255, 255, 0, 0.4)' },
      [lastMove.to]: { background: 'rgba(255, 255, 0, 0.4)' }
    } : {})
  };

  const boardOrientation = currentGame.isSpectating 
    ? 'white' 
    : (currentGame.playerColor || 'white');

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-[#312e2b] p-4 rounded-lg shadow-2xl">
        <Chessboard
          position={gamePosition}
          onPieceDrop={onPieceDrop}
          boardOrientation={boardOrientation}
          customSquareStyles={customSquareStyles}
          customBoardStyle={{
            borderRadius: '6px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
          customLightSquareStyle={{
            backgroundColor: '#EBECD0'
          }}
          customDarkSquareStyle={{
            backgroundColor: '#739552'
          }}
          customDropSquareStyle={{
            boxShadow: 'inset 0 0 1px 6px rgba(255,255,255,0.75)'
          }}
          arePremovesAllowed={!currentGame.isSpectating}
          areArrowsAllowed={true}
        />
      </div>
    </div>
  );
};

const GameControls: React.FC<{ gameId: string }> = ({ gameId }) => {
  const { currentGame, setDrawOffer } = useMultiplayerStore();
  const [showResignConfirm, setShowResignConfirm] = useState(false);

  const handleDrawOffer = () => {
    if (currentGame.drawOfferedBy === currentGame.playerColor) {
      // Cancel draw offer
      socketManager.declineDraw(gameId);
      setDrawOffer(null);
    } else if (currentGame.drawOfferedBy) {
      // Accept opponent's draw offer
      socketManager.acceptDraw(gameId);
    } else {
      // Offer draw
      socketManager.offerDraw(gameId);
      setDrawOffer(currentGame.playerColor);
    }
  };

  const handleResign = () => {
    if (showResignConfirm) {
      socketManager.resignGame(gameId);
      setShowResignConfirm(false);
    } else {
      setShowResignConfirm(true);
      setTimeout(() => setShowResignConfirm(false), 5000);
    }
  };

  if (currentGame.isSpectating || !currentGame.gameState || currentGame.gameState.status !== 'active') {
    return null;
  }

  const drawButtonText = currentGame.drawOfferedBy === currentGame.playerColor 
    ? 'Cancel Draw' 
    : currentGame.drawOfferedBy 
    ? 'Accept Draw' 
    : 'Offer Draw';

  const drawButtonClass = currentGame.drawOfferedBy 
    ? 'btn-primary bg-blue-600 hover:bg-blue-700' 
    : 'btn-secondary';

  return (
    <div className="flex gap-3 justify-center mt-4">
      <button
        onClick={handleDrawOffer}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${drawButtonClass}`}
      >
        {drawButtonText}
      </button>
      
      <button
        onClick={handleResign}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          showResignConfirm 
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'btn-secondary hover:bg-red-600/20 hover:text-red-400'
        }`}
      >
        {showResignConfirm ? 'Confirm Resign' : 'Resign'}
      </button>
    </div>
  );
};

const GameStatus: React.FC = () => {
  const { currentGame } = useMultiplayerStore();

  if (!currentGame.gameState) return null;

  const getStatusMessage = () => {
    if (currentGame.gameState!.status === 'active') {
      const turnText = currentGame.gameState!.turn === 'white' ? 'White' : 'Black';
      const playerName = currentGame.gameState!.turn === 'white' 
        ? currentGame.gameRoom?.white.username
        : currentGame.gameRoom?.black.username;
      
      if (currentGame.isSpectating) {
        return `${turnText} to move (${playerName})`;
      } else {
        const isPlayerTurn = currentGame.gameState!.turn === currentGame.playerColor;
        return isPlayerTurn ? 'Your turn' : `${playerName} to move`;
      }
    }

    switch (currentGame.gameState!.status) {
      case 'checkmate':
        return `Checkmate! ${currentGame.gameState!.winner === 'white' ? 'White' : 'Black'} wins`;
      case 'draw':
        return `Draw - ${currentGame.gameState!.reason}`;
      case 'resigned':
        return `${currentGame.gameState!.winner === 'white' ? 'Black' : 'White'} resigned`;
      case 'timeout':
        return `${currentGame.gameState!.winner === 'white' ? 'Black' : 'White'} ran out of time`;
      default:
        return 'Game ended';
    }
  };

  const statusColor = currentGame.gameState.status === 'active' 
    ? 'text-green-400' 
    : 'text-orange-400';

  return (
    <div className={`text-center text-lg font-medium ${statusColor} mb-4`}>
      {getStatusMessage()}
      {currentGame.drawOfferedBy && currentGame.gameState.status === 'active' && (
        <div className="text-blue-400 text-sm mt-1">
          Draw offered by {currentGame.drawOfferedBy}
        </div>
      )}
    </div>
  );
};

const LiveChessGame: React.FC<LiveChessBoardProps> = ({ gameId }) => {
  const { currentGame } = useMultiplayerStore();

  if (!currentGame.gameState || !currentGame.gameRoom) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="glass-panel p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left sidebar - Player info and timers */}
        <div className="space-y-4">
          <PlayerInfoCard 
            player={currentGame.gameRoom.black} 
            isPlayerTurn={currentGame.gameState.turn === 'black'}
            color="black"
          />
          <GameTimer 
            timeLeft={currentGame.gameState.blackTime}
            isActive={currentGame.gameState.turn === 'black' && currentGame.gameState.status === 'active'}
            color="black"
          />
        </div>

        {/* Center - Chess board */}
        <div className="lg:col-span-2">
          <GameStatus />
          <LiveChessBoard gameId={gameId} />
          <GameControls gameId={gameId} />
        </div>

        {/* Right sidebar - Chat and white player */}
        <div className="space-y-4">
          <PlayerInfoCard 
            player={currentGame.gameRoom.white} 
            isPlayerTurn={currentGame.gameState.turn === 'white'}
            color="white"
          />
          <GameTimer 
            timeLeft={currentGame.gameState.whiteTime}
            isActive={currentGame.gameState.turn === 'white' && currentGame.gameState.status === 'active'}
            color="white"
          />
          <GameChat gameId={gameId} />
        </div>
      </div>
    </div>
  );
};

export default LiveChessGame;