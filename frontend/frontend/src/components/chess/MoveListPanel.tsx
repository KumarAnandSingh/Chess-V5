import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { BookOpen } from 'lucide-react';

interface Move {
  moveNumber: number;
  white?: string;
  black?: string;
  san: string;
  piece?: string;
}

interface MoveListPanelProps {
  moves: Move[];
  opening?: string;
  currentMoveIndex?: number;
  className?: string;
}

const MoveListPanel: React.FC<MoveListPanelProps> = ({
  moves,
  opening = "Bird's Opening",
  currentMoveIndex = -1,
  className = ''
}) => {
  // Map piece letters to Unicode chess symbols for notation
  const pieceSymbols: Record<string, string> = {
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
  };

  // Enhanced move formatting with piece symbols
  const formatMoveWithSymbols = (move: string) => {
    // Common chess notation patterns
    let formattedMove = move;

    // Replace piece letters with symbols (except pawns which don't have letters)
    formattedMove = formattedMove.replace(/^([KQRBN])/, (match, piece) => {
      return pieceSymbols[piece] || piece;
    });

    // Handle castling
    if (formattedMove === 'O-O' || formattedMove === '0-0') {
      return '♔ O-O';
    }
    if (formattedMove === 'O-O-O' || formattedMove === '0-0-0') {
      return '♔ O-O-O';
    }

    // Handle check and checkmate symbols
    formattedMove = formattedMove.replace(/\+$/, '+');
    formattedMove = formattedMove.replace(/#$/, '#');

    return formattedMove;
  };

  // Generate move pairs for two-column display
  const movePairs: Array<{ moveNumber: number; white?: string; black?: string }> = [];
  let currentPair: { moveNumber: number; white?: string; black?: string } | null = null;

  moves.forEach((move, index) => {
    if (index % 2 === 0) {
      // White move (even index)
      currentPair = {
        moveNumber: Math.floor(index / 2) + 1,
        white: move.san,
        black: undefined
      };
      movePairs.push(currentPair);
    } else {
      // Black move (odd index)
      if (currentPair) {
        currentPair.black = move.san;
      }
    }
  });

  return (
    <Card className={`h-full max-h-[500px] ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5 text-amber-600" />
          <span>{opening}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="max-h-[400px] overflow-y-auto">
          {movePairs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <div className="text-4xl mb-2">♟</div>
              <p>Game will start soon...</p>
            </div>
          ) : (
            <div className="px-4 pb-4">
              {/* Move list header */}
              <div className="grid grid-cols-[40px,1fr,1fr] gap-2 py-2 border-b border-gray-200 text-sm font-semibold text-gray-600">
                <div>#</div>
                <div>White</div>
                <div>Black</div>
              </div>

              {/* Move list */}
              <div className="space-y-1 mt-2">
                {movePairs.map((pair, index) => {
                  const whiteIndex = index * 2;
                  const blackIndex = index * 2 + 1;
                  const isWhiteActive = currentMoveIndex === whiteIndex;
                  const isBlackActive = currentMoveIndex === blackIndex;

                  return (
                    <div
                      key={pair.moveNumber}
                      className="grid grid-cols-[40px,1fr,1fr] gap-2 py-1.5 hover:bg-gray-50 rounded text-sm"
                    >
                      <div className="text-gray-500 font-mono">
                        {pair.moveNumber}.
                      </div>

                      <div className={`font-medium ${isWhiteActive ? 'bg-blue-100 text-blue-800 px-1 rounded' : 'text-gray-800'}`}>
                        {pair.white ? formatMoveWithSymbols(pair.white) : ''}
                      </div>

                      <div className={`font-medium ${isBlackActive ? 'bg-blue-100 text-blue-800 px-1 rounded' : 'text-gray-800'}`}>
                        {pair.black ? formatMoveWithSymbols(pair.black) : '...'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Game status footer */}
        {moves.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-600">
                Move {Math.ceil(moves.length / 2)} • {moves.length} plies
              </div>
              <Badge variant="outline" className="text-xs">
                In Progress
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoveListPanel;