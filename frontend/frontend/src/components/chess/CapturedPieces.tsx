import React from 'react';
import { Badge } from '../ui/badge';

interface CapturedPiecesProps {
  pieces: string[];
  color: 'white' | 'black';
  title: string;
  className?: string;
}

const CapturedPieces: React.FC<CapturedPiecesProps> = ({
  pieces,
  color,
  title,
  className = ''
}) => {
  // Map piece letters to Unicode chess symbols
  const pieceSymbols: Record<string, string> = {
    'p': color === 'white' ? '♙' : '♟',
    'r': color === 'white' ? '♖' : '♜',
    'n': color === 'white' ? '♘' : '♞',
    'b': color === 'white' ? '♗' : '♝',
    'q': color === 'white' ? '♕' : '♛',
    'k': color === 'white' ? '♔' : '♚',
  };

  // Count pieces by type
  const pieceCounts = pieces.reduce((counts, piece) => {
    counts[piece] = (counts[piece] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  // Calculate total point value (traditional chess piece values)
  const pieceValues: Record<string, number> = {
    'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0
  };

  const totalValue = pieces.reduce((sum, piece) => sum + (pieceValues[piece] || 0), 0);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">{title}</h4>
        {pieces.length > 0 && (
          <Badge variant="outline" className="text-xs">
            {totalValue} pts
          </Badge>
        )}
      </div>

      <div className="min-h-[2rem] p-2 bg-gray-50 rounded-md border border-gray-200">
        {pieces.length === 0 ? (
          <div className="text-xs text-gray-400 text-center">No captures</div>
        ) : (
          <div className="flex flex-wrap gap-1">
            {Object.entries(pieceCounts).map(([piece, count]) => (
              <div key={piece} className="flex items-center">
                <span className="text-lg" title={`${piece.toUpperCase()}: ${count}`}>
                  {pieceSymbols[piece] || piece}
                </span>
                {count > 1 && (
                  <span className="text-xs ml-1 bg-gray-200 rounded-full px-1.5 py-0.5 font-medium">
                    {count}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CapturedPieces;