import { io, Socket } from 'socket.io-client';
import { SocketEvents, ConnectionStatus, MultiplayerConfig } from '../types/multiplayer';

class WebSocketManager {
  private socket: Socket | null = null;
  private config: MultiplayerConfig;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private connectionStatus: ConnectionStatus = 'disconnected';
  private eventListeners = new Map<string, Set<Function>>();

  constructor(config: MultiplayerConfig) {
    this.config = config;
    this.maxReconnectAttempts = config.reconnectAttempts;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      this.connectionStatus = 'connecting';
      this.emitStatusChange();

      this.socket = io(this.config.backendUrl, {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnection: false, // We'll handle reconnection manually
        forceNew: true,
      });

      const connectTimeout = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, 10000);

      this.socket.on('connect', () => {
        clearTimeout(connectTimeout);
        this.connectionStatus = 'connected';
        this.reconnectAttempts = 0;
        this.emitStatusChange();
        this.startHeartbeat();
        resolve();
      });

      this.socket.on('disconnect', (reason) => {
        clearTimeout(connectTimeout);
        this.connectionStatus = 'disconnected';
        this.emitStatusChange();
        this.stopHeartbeat();
        
        if (reason === 'io server disconnect') {
          // Server disconnected us, don't try to reconnect immediately
          console.log('Server disconnected the client');
        } else {
          // Network issue or client-side disconnect, try to reconnect
          this.attemptReconnect();
        }
      });

      this.socket.on('connect_error', (error) => {
        clearTimeout(connectTimeout);
        this.connectionStatus = 'error';
        this.emitStatusChange();
        console.error('Connection error:', error);
        reject(error);
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
        this.emit('error', { message: error.message || 'Socket error' });
      });

      // Set up event forwarding
      this.setupEventForwarding();
    });
  }

  disconnect(): void {
    this.stopReconnection();
    this.stopHeartbeat();
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    
    this.connectionStatus = 'disconnected';
    this.emitStatusChange();
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.connectionStatus = 'error';
      this.emitStatusChange();
      return;
    }

    this.connectionStatus = 'reconnecting';
    this.emitStatusChange();
    this.reconnectAttempts++;

    const delay = Math.min(this.config.reconnectDelay * this.reconnectAttempts, 30000);
    
    this.reconnectTimeout = setTimeout(() => {
      console.log(`Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      this.connect().catch((error) => {
        console.error('Reconnection failed:', error);
        this.attemptReconnect();
      });
    }, delay);
  }

  private stopReconnection(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.reconnectAttempts = 0;
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      if (this.socket?.connected) {
        this.socket.emit('heartbeat');
      }
    }, this.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private setupEventForwarding(): void {
    if (!this.socket) return;

    // Forward all socket events to our event system
    const events: (keyof SocketEvents)[] = [
      'authenticated',
      'matchmaking_joined',
      'matchmaking_left',
      'game_found',
      'game_started',
      'move_made',
      'game_ended',
      'chat_message',
      'player_disconnected',
      'player_reconnected',
      'draw_offered',
      'draw_declined',
      'spectator_joined',
      'spectator_left',
      'error'
    ];

    events.forEach(event => {
      this.socket!.on(event, (data) => {
        this.emit(event, data);
      });
    });
  }

  // Event system
  on<K extends keyof SocketEvents>(event: K | 'status_change', callback: (data: any) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off<K extends keyof SocketEvents>(event: K | 'status_change', callback: (data: any) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  private emitStatusChange(): void {
    this.emit('status_change', { status: this.connectionStatus });
  }

  // Socket communication methods
  authenticate(userId: string, username: string, rating: number): void {
    if (this.socket?.connected) {
      this.socket.emit('authenticate', { userId, username, rating });
    }
  }

  joinMatchmaking(timeControl: SocketEvents['join_matchmaking']['timeControl'], ratingRange?: SocketEvents['join_matchmaking']['ratingRange']): void {
    if (this.socket?.connected) {
      this.socket.emit('join_matchmaking', { timeControl, ratingRange });
    }
  }

  leaveMatchmaking(): void {
    if (this.socket?.connected) {
      this.socket.emit('leave_matchmaking', {});
    }
  }

  makeMove(gameId: string, move: string, timeLeft: number): void {
    if (this.socket?.connected) {
      this.socket.emit('make_move', { gameId, move, timeLeft });
    }
  }

  offerDraw(gameId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('offer_draw', { gameId });
    }
  }

  resignGame(gameId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('resign_game', { gameId });
    }
  }

  joinGameAsSpectator(gameId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('join_game_as_spectator', { gameId });
    }
  }

  sendChatMessage(gameId: string, message: string): void {
    if (this.socket?.connected) {
      this.socket.emit('send_chat_message', { gameId, message });
    }
  }

  // Getters
  get status(): ConnectionStatus {
    return this.connectionStatus;
  }

  get isConnected(): boolean {
    return this.socket?.connected === true;
  }

  get reconnectAttemptsLeft(): number {
    return Math.max(0, this.maxReconnectAttempts - this.reconnectAttempts);
  }
}

// Create singleton instance
const defaultConfig: MultiplayerConfig = {
  backendUrl: process.env.NODE_ENV === 'production' 
    ? 'wss://your-production-domain.com'  // Replace with actual production URL
    : 'http://localhost:3001',
  reconnectAttempts: 5,
  reconnectDelay: 2000,
  heartbeatInterval: 30000,
};

export const websocketManager = new WebSocketManager(defaultConfig);
export default WebSocketManager;