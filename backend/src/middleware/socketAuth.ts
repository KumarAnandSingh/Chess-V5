import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  user?: {
    id: string;
    username: string;
    rating: number;
  };
}

/**
 * Middleware to authenticate socket connections
 * This can be used to verify users before they join games
 */
export const authenticateSocket = (socket: any, next: (err?: Error) => void) => {
  try {
    // For now, we'll implement a simple authentication
    // In production, you'd want to verify JWT tokens or session data
    
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    
    if (!token) {
      // Allow unauthenticated connections for guests
      // They can still spectate games but not play rated games
      return next();
    }
    
    // Verify JWT token if present
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    
    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        return next(new Error('Authentication failed'));
      }
      
      // Attach user info to socket
      socket.userId = decoded.id;
      socket.user = {
        id: decoded.id,
        username: decoded.username || 'Anonymous',
        rating: decoded.rating || 1200
      };
      
      next();
    });
    
  } catch (error) {
    console.error('Socket authentication error:', error);
    next(new Error('Authentication failed'));
  }
};

/**
 * Middleware to require authentication for certain socket events
 */
export const requireAuth = (socket: any, next: (err?: Error) => void) => {
  if (!socket.userId) {
    return next(new Error('Authentication required'));
  }
  next();
};

/**
 * Helper function to verify if socket is authenticated
 */
export const isAuthenticated = (socket: any): boolean => {
  return !!socket.userId;
};

/**
 * Helper function to get user info from socket
 */
export const getSocketUser = (socket: any): { id: string; username: string; rating: number } | null => {
  if (!socket.user) {
    return null;
  }
  
  return {
    id: socket.user.id,
    username: socket.user.username,
    rating: socket.user.rating
  };
};