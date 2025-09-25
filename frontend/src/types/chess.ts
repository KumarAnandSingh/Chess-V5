// Chess game types and interfaces

export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type PieceColor = 'white' | 'black';
export type Square = string; // e.g., 'e4', 'a1'

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
}

export interface ChessMove {
  from: Square;
  to: Square;
  piece: ChessPiece;
  captured?: ChessPiece;
  promotion?: PieceType;
  castling?: boolean;
  enPassant?: boolean;
  check?: boolean;
  checkmate?: boolean;
  san: string; // Standard Algebraic Notation
  fen?: string; // Position after move
}

export interface ChessPosition {
  fen: string;
  turn: PieceColor;
  castlingRights: {
    whiteKingside: boolean;
    whiteQueenside: boolean;
    blackKingside: boolean;
    blackQueenside: boolean;
  };
  enPassantSquare?: Square;
  halfMoveClock: number;
  fullMoveNumber: number;
}

export interface ChessGame {
  id: string;
  position: ChessPosition;
  history: ChessMove[];
  status: 'playing' | 'checkmate' | 'stalemate' | 'draw' | 'resigned';
  winner?: PieceColor;
  startTime: Date;
  endTime?: Date;
}

export interface PuzzlePosition extends ChessPosition {
  solution: ChessMove[];
  theme: string[];
  difficulty: number; // 1-5 scale
  rating?: number;
}

export interface ChessPuzzle {
  id: string;
  position: PuzzlePosition;
  instructions: string;
  hints?: string[];
  explanation: string;
  tags: string[];
}

// Chess board interaction types
export interface SquareStyle {
  backgroundColor?: string;
  border?: string;
  borderRadius?: string;
  boxShadow?: string;
}

export interface ChessBoardProps {
  position: string; // FEN notation
  onMove?: (move: ChessMove) => void;
  onSquareClick?: (square: Square) => void;
  highlightedSquares?: Record<Square, SquareStyle>;
  allowedMoves?: Square[];
  boardOrientation?: PieceColor;
  showCoordinates?: boolean;
  animationDuration?: number;
  disabled?: boolean;
}

// Analysis and evaluation types
export interface MoveAnalysis {
  move: ChessMove;
  evaluation: number; // Centipawns
  depth: number;
  bestMove: boolean;
  blunder: boolean;
  mistake: boolean;
  inaccuracy: boolean;
  brilliant: boolean;
  good: boolean;
  engine: string;
}

export interface PositionAnalysis {
  fen: string;
  evaluation: number;
  depth: number;
  bestMoves: ChessMove[];
  threats: string[];
  weaknesses: string[];
  suggestions: string[];
}