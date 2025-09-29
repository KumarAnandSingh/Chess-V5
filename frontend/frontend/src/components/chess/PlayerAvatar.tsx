import React from 'react';
import { Badge } from '../ui/badge';

interface PlayerAvatarProps {
  playerName: string;
  rating: number;
  isCurrentPlayer?: boolean;
  capturedPieces: string[];
  playerColor: 'white' | 'black';
  position: 'top' | 'bottom';
  className?: string;
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  playerName,
  rating,
  isCurrentPlayer = false,
  capturedPieces,
  playerColor,
  position,
  className = ''
}) => {
  // Map piece letters to Unicode chess symbols
  const pieceSymbols: Record<string, string> = {
    'p': playerColor === 'white' ? '♟' : '♙', // Captured pawns show opposite color
    'r': playerColor === 'white' ? '♜' : '♖',
    'n': playerColor === 'white' ? '♞' : '♘',
    'b': playerColor === 'white' ? '♝' : '♗',
    'q': playerColor === 'white' ? '♛' : '♕',
    'k': playerColor === 'white' ? '♚' : '♔',
  };

  // Calculate point advantage
  const pieceValues: Record<string, number> = {
    'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0
  };

  const totalValue = capturedPieces.reduce((sum, piece) => sum + (pieceValues[piece] || 0), 0);

  // Generate avatar background color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
      'bg-yellow-500', 'bg-indigo-500', 'bg-red-500', 'bg-teal-500'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const avatarColor = getAvatarColor(playerName);

  return (
    <div className={`flex items-center gap-3 p-3 ${className}`}>
      {/* Player Avatar and Info */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className={`w-10 h-10 ${avatarColor} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
          {playerName.charAt(0).toUpperCase()}
        </div>

        {/* Player Name and Rating */}
        <div>
          <div className={`font-semibold text-lg ${isCurrentPlayer ? 'text-blue-600' : 'text-gray-900'}`}>
            {playerName}
            {isCurrentPlayer && (
              <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                You
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600">
            ({rating})
          </div>
        </div>
      </div>

      {/* Captured Pieces - Horizontal Layout */}
      <div className="flex items-center gap-2 flex-1">
        {capturedPieces.length > 0 && (
          <>
            {/* Captured piece symbols */}
            <div className="flex items-center gap-1">
              {capturedPieces.map((piece, index) => (
                <span key={index} className="text-xl" title={`Captured ${piece.toUpperCase()}`}>
                  {pieceSymbols[piece] || piece}
                </span>
              ))}
            </div>

            {/* Point advantage */}
            {totalValue > 0 && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 font-bold">
                +{totalValue}
              </Badge>
            )}
          </>
        )}

        {capturedPieces.length === 0 && (
          <div className="text-sm text-gray-400">
            No captures
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerAvatar;