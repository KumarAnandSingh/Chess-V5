export interface Player {
  id: string;
  username: string;
  rating: number;
  color: 'white' | 'black';
  timeLeft: number;
  isConnected: boolean;
}

export interface GameState {
  id: string;
  fen: string;
  pgn: string;
  currentTurn: 'white' | 'black';
  status: 'waiting' | 'active' | 'paused' | 'finished';
  result?: 'white_wins' | 'black_wins' | 'draw' | 'abandoned';
  reason?: string;
  startedAt: string;
  endedAt?: string;
}

export interface MultiplayerGame {
  id: string;
  gameState: GameState;
  players: {
    white: Player;
    black: Player;
  };
  timeControl: TimeControl;
  spectators: Player[];
  chatMessages: ChatMessage[];
  drawOffer?: {
    fromPlayer: 'white' | 'black';
    timestamp: string;
  };
}

export interface TimeControl {
  initialTime: number; // in seconds
  increment: number; // in seconds
  type: 'bullet' | 'blitz' | 'rapid' | 'classical';
}

export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  type: 'message' | 'system';
}

export interface MatchmakingQueue {
  timeControl: TimeControl;
  ratingRange?: {
    min: number;
    max: number;
  };
  estimatedWaitTime?: number;
  queuePosition?: number;
  joinedAt: string;
}

export interface PlayerStats {
  userId: string;
  username: string;
  rating: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
}

export interface GameResult {
  gameId: string;
  result: 'white_wins' | 'black_wins' | 'draw';
  reason: string;
  ratingChanges: {
    white: {
      oldRating: number;
      newRating: number;
      change: number;
    };
    black: {
      oldRating: number;
      newRating: number;
      change: number;
    };
  };
  gameStats: {
    moves: number;
    duration: number;
    avgMoveTime: number;
  };
}

// WebSocket Events
export interface SocketEvents {
  // Client to Server
  authenticate: { userId: string; username: string; rating: number };
  join_matchmaking: { timeControl: TimeControl; ratingRange?: { min: number; max: number } };
  leave_matchmaking: {};
  make_move: { gameId: string; move: string; timeLeft: number };
  offer_draw: { gameId: string };
  resign_game: { gameId: string };
  join_game_as_spectator: { gameId: string };
  send_chat_message: { gameId: string; message: string };

  // Server to Client
  authenticated: { success: boolean; playerInfo: PlayerStats };
  matchmaking_joined: { estimatedWaitTime: number; queuePosition: number };
  matchmaking_left: {};
  game_found: { gameId: string; opponent: Player; color: 'white' | 'black'; timeControl: TimeControl };
  game_started: { gameState: GameState; players: { white: Player; black: Player }; timeControl: TimeControl };
  move_made: { gameState: GameState; move: string; timeLeft: { white: number; black: number } };
  game_ended: GameResult;
  chat_message: ChatMessage;
  player_disconnected: { playerId: string; reconnecting: boolean };
  player_reconnected: { playerId: string };
  draw_offered: { fromPlayer: 'white' | 'black' };
  draw_declined: { byPlayer: 'white' | 'black' };
  spectator_joined: { spectator: Player };
  spectator_left: { spectatorId: string };
  error: { message: string; code?: string };
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error';

export interface MultiplayerConfig {
  backendUrl: string;
  reconnectAttempts: number;
  reconnectDelay: number;
  heartbeatInterval: number;
}