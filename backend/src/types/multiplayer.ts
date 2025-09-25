import { Socket } from 'socket.io';

export interface PlayerSocket {
  id: string;
  userId: string;
  username: string;
  rating: number;
  socket: Socket;
}

export interface TimeControl {
  initial: number; // in seconds
  increment: number; // in seconds
  type: 'blitz' | 'rapid' | 'classical';
}

export interface GameRoom {
  id: string;
  white: PlayerSocket;
  black: PlayerSocket;
  gameState: any;
  spectators: PlayerSocket[];
  timeControl: TimeControl;
  startTime: Date;
  lastMoveTime: Date;
  whiteTime: number;
  blackTime: number;
}

export interface GameState {
  id: string;
  position: string;
  moves: string[];
  turn: 'white' | 'black';
  status: 'active' | 'checkmate' | 'draw' | 'resigned' | 'timeout';
  result?: '1-0' | '0-1' | '1/2-1/2';
  winner?: 'white' | 'black' | null;
  reason?: string;
  moveNumber: number;
  whiteTime: number;
  blackTime: number;
  whiteRatingChange?: number;
  blackRatingChange?: number;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  finalPosition?: string;
}