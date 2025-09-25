import { Chess } from 'chess.js';

/**
 * Validates a chess move against the current game state
 * @param gameState - The chess.js instance representing current game state
 * @param move - The move to validate (can be string or object)
 * @param playerId - The ID of the player making the move
 * @returns boolean indicating if the move is valid
 */
export function validateMove(gameState: Chess, move: any, playerId: string): boolean {
  try {
    // Create a copy of the game state to test the move without modifying the original
    const testGame = new Chess(gameState.fen());
    
    // Attempt to make the move
    const result = testGame.move(move);
    
    // If move() returns null, the move is invalid
    return result !== null;
  } catch (error) {
    console.error('Error validating move:', error);
    return false;
  }
}

/**
 * Validates if it's the correct player's turn
 * @param gameState - The chess.js instance representing current game state  
 * @param playerId - The ID of the player attempting to move
 * @param whitePlayerId - The ID of the white player
 * @returns boolean indicating if it's this player's turn
 */
export function validatePlayerTurn(gameState: Chess, playerId: string, whitePlayerId: string): boolean {
  const currentTurn = gameState.turn(); // 'w' for white, 'b' for black
  const isWhitePlayer = playerId === whitePlayerId;
  
  return (currentTurn === 'w' && isWhitePlayer) || (currentTurn === 'b' && !isWhitePlayer);
}

/**
 * Sanitizes move input to ensure it's in the correct format
 * @param move - Raw move input from client
 * @returns sanitized move object or null if invalid
 */
export function sanitizeMove(move: any): any {
  if (!move) return null;
  
  // If move is a string (SAN notation like "e4", "Nf3", etc.)
  if (typeof move === 'string') {
    return move.trim();
  }
  
  // If move is an object (from/to notation)
  if (typeof move === 'object' && move.from && move.to) {
    const sanitized: any = {
      from: move.from.toLowerCase().trim(),
      to: move.to.toLowerCase().trim()
    };
    
    // Add promotion if specified
    if (move.promotion) {
      sanitized.promotion = move.promotion.toLowerCase();
    }
    
    // Validate square format (e.g., "e2", "a1")
    const squareRegex = /^[a-h][1-8]$/;
    if (!squareRegex.test(sanitized.from) || !squareRegex.test(sanitized.to)) {
      return null;
    }
    
    return sanitized;
  }
  
  return null;
}

/**
 * Checks if a position is valid FEN
 * @param fen - FEN string to validate
 * @returns boolean indicating if FEN is valid
 */
export function validateFEN(fen: string): boolean {
  try {
    const chess = new Chess(fen);
    return chess.fen() === fen;
  } catch (error) {
    return false;
  }
}

/**
 * Gets all legal moves for the current position
 * @param gameState - The chess.js instance representing current game state
 * @returns array of legal moves in SAN notation
 */
export function getLegalMoves(gameState: Chess): string[] {
  try {
    return gameState.moves();
  } catch (error) {
    console.error('Error getting legal moves:', error);
    return [];
  }
}

/**
 * Gets all legal moves for a specific square
 * @param gameState - The chess.js instance representing current game state
 * @param square - The square to get moves for (e.g., "e2")
 * @returns array of legal moves from that square
 */
export function getLegalMovesForSquare(gameState: Chess, square: string): any[] {
  try {
    return gameState.moves({ 
      square: square as any,
      verbose: true 
    });
  } catch (error) {
    console.error('Error getting legal moves for square:', error);
    return [];
  }
}

/**
 * Checks if the current position is a check
 * @param gameState - The chess.js instance representing current game state
 * @returns boolean indicating if current player is in check
 */
export function isInCheck(gameState: Chess): boolean {
  try {
    return gameState.inCheck();
  } catch (error) {
    return false;
  }
}

/**
 * Checks if the current position is checkmate
 * @param gameState - The chess.js instance representing current game state
 * @returns boolean indicating if current player is in checkmate
 */
export function isCheckmate(gameState: Chess): boolean {
  try {
    return gameState.isCheckmate();
  } catch (error) {
    return false;
  }
}

/**
 * Checks if the current position is stalemate
 * @param gameState - The chess.js instance representing current game state
 * @returns boolean indicating if current position is stalemate
 */
export function isStalemate(gameState: Chess): boolean {
  try {
    return gameState.isStalemate();
  } catch (error) {
    return false;
  }
}

/**
 * Checks if the game is drawn by various rules
 * @param gameState - The chess.js instance representing current game state
 * @returns object with draw status and reason
 */
export function checkDrawConditions(gameState: Chess): { isDraw: boolean; reason?: string } {
  try {
    if (gameState.isStalemate()) {
      return { isDraw: true, reason: 'stalemate' };
    }
    
    if (gameState.isInsufficientMaterial()) {
      return { isDraw: true, reason: 'insufficient_material' };
    }
    
    if (gameState.isThreefoldRepetition()) {
      return { isDraw: true, reason: 'threefold_repetition' };
    }
    
    if (gameState.isDraw()) {
      return { isDraw: true, reason: 'fifty_move_rule' };
    }
    
    return { isDraw: false };
  } catch (error) {
    console.error('Error checking draw conditions:', error);
    return { isDraw: false };
  }
}

/**
 * Converts move to algebraic notation
 * @param gameState - The chess.js instance representing current game state
 * @param move - The move object to convert
 * @returns move in Standard Algebraic Notation (SAN)
 */
export function moveToSAN(gameState: Chess, move: any): string | null {
  try {
    // Create a copy to test the move
    const testGame = new Chess(gameState.fen());
    const result = testGame.move(move);
    
    return result ? result.san : null;
  } catch (error) {
    console.error('Error converting move to SAN:', error);
    return null;
  }
}

/**
 * Gets the current game status
 * @param gameState - The chess.js instance representing current game state
 * @returns object with game status information
 */
export function getGameStatus(gameState: Chess): {
  status: 'active' | 'checkmate' | 'stalemate' | 'draw';
  winner?: 'white' | 'black' | null;
  reason?: string;
  inCheck: boolean;
  turn: 'white' | 'black';
} {
  try {
    const inCheck = gameState.inCheck();
    const turn = gameState.turn() === 'w' ? 'white' : 'black';
    
    if (gameState.isCheckmate()) {
      return {
        status: 'checkmate',
        winner: turn === 'white' ? 'black' : 'white', // Opposite of current turn
        reason: 'checkmate',
        inCheck,
        turn
      };
    }
    
    if (gameState.isStalemate()) {
      return {
        status: 'stalemate',
        winner: null,
        reason: 'stalemate',
        inCheck,
        turn
      };
    }
    
    const drawCheck = checkDrawConditions(gameState);
    if (drawCheck.isDraw) {
      return {
        status: 'draw',
        winner: null,
        reason: drawCheck.reason,
        inCheck,
        turn
      };
    }
    
    return {
      status: 'active',
      inCheck,
      turn
    };
  } catch (error) {
    console.error('Error getting game status:', error);
    return {
      status: 'active',
      inCheck: false,
      turn: 'white'
    };
  }
}