import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { Chess } from 'chess.js';
import { PlayerSocket, GameRoom, TimeControl } from '../types/multiplayer';

interface SimpleGame {
  id: string;
  white: PlayerSocket;
  black: PlayerSocket;
  chess: Chess;
  timeControl: TimeControl;
  whiteTime: number;
  blackTime: number;
  lastMoveTime: number;
  spectators: PlayerSocket[];
  status: 'active' | 'finished';
}

class SimpleWebSocketService {
  private io: SocketIOServer;
  private connectedUsers: Map<string, PlayerSocket>;
  private activeGames: Map<string, SimpleGame>;
  private matchmakingQueue: PlayerSocket[];

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: [
          "http://localhost:5173",
          "http://localhost:5174", 
          "http://localhost:3000",
          "https://studyify.in",
          "https://www.studyify.in"
        ],
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.connectedUsers = new Map();
    this.activeGames = new Map();
    this.matchmakingQueue = [];

    this.setupSocketHandlers();
    
    console.log('🎮 Simple WebSocket server initialized for real-time multiplayer');
  }

  private setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`👤 User connected: ${socket.id}`);

      // Handle user authentication
      socket.on('authenticate', async (data: { userId: string; username: string; rating?: number }) => {
        try {
          const playerSocket: PlayerSocket = {
            id: socket.id,
            userId: data.userId,
            username: data.username,
            rating: data.rating || 1200,
            socket
          };

          this.connectedUsers.set(socket.id, playerSocket);

          socket.emit('authenticated', {
            success: true,
            playerInfo: {
              id: playerSocket.id,
              username: playerSocket.username,
              rating: playerSocket.rating
            }
          });

          console.log(`✅ User authenticated: ${data.username} (${data.userId})`);
        } catch (error) {
          socket.emit('authentication_error', { message: 'Authentication failed' });
        }
      });

      // Handle matchmaking
      socket.on('join_matchmaking', async (data: { timeControl: TimeControl }) => {
        try {
          const player = this.connectedUsers.get(socket.id);
          if (!player) {
            socket.emit('error', { message: 'User not authenticated' });
            return;
          }

          console.log(`🔍 ${player.username} joining matchmaking queue`);
          
          // Simple matchmaking - just pair with anyone in queue
          if (this.matchmakingQueue.length > 0) {
            const opponent = this.matchmakingQueue.shift()!;
            
            // Don't allow same user to play themselves
            if (opponent.userId === player.userId) {
              // Put opponent back in queue and add current player
              this.matchmakingQueue.unshift(opponent);
              this.matchmakingQueue.push(player);
              socket.emit('matchmaking_queued', { 
                message: 'Looking for opponent...',
                queuePosition: this.matchmakingQueue.length
              });
              return;
            }
            
            // Create game
            const gameId = 'game-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
            const chess = new Chess();
            
            // Assign colors randomly but ensure different players
            const playerIsWhite = Math.random() > 0.5;
            const game: SimpleGame = {
              id: gameId,
              white: playerIsWhite ? player : opponent,
              black: playerIsWhite ? opponent : player,
              chess,
              timeControl: data.timeControl,
              whiteTime: data.timeControl.initial * 1000, // Convert to milliseconds
              blackTime: data.timeControl.initial * 1000,
              lastMoveTime: Date.now(),
              spectators: [],
              status: 'active'
            };

            this.activeGames.set(gameId, game);

            // Join both players to game room
            player.socket.join(gameId);
            opponent.socket.join(gameId);

            // Notify both players with individualized payloads
            const basePayload = {
              gameId: gameId,
              white: {
                username: game.white.username,
                rating: game.white.rating,
                userId: game.white.userId
              },
              black: {
                username: game.black.username,
                rating: game.black.rating,
                userId: game.black.userId
              },
              timeControl: game.timeControl,
              position: chess.fen(),
              whiteTime: game.whiteTime,
              blackTime: game.blackTime,
              turn: game.chess.turn(),
              moveNumber: game.chess.moveNumber()
            };

            game.white.socket.emit('game_started', {
              success: true,
              ...basePayload,
              playerColor: 'white',
              message: 'Game started'
            });

            game.black.socket.emit('game_started', {
              success: true,
              ...basePayload,
              playerColor: 'black',
              message: 'Game started'
            });

            console.log(`🎮 Game created: ${gameId} - ${game.white.username} (white) vs ${game.black.username} (black)`);
          } else {
            // Add to queue
            this.matchmakingQueue.push(player);
            socket.emit('matchmaking_queued', { 
              message: 'Looking for opponent...',
              queuePosition: this.matchmakingQueue.length
            });
          }
        } catch (error) {
          console.error('Matchmaking error:', error);
          socket.emit('matchmaking_error', { message: 'Failed to join matchmaking' });
        }
      });

      // Handle leaving matchmaking queue
      socket.on('leave_matchmaking', () => {
        const player = this.connectedUsers.get(socket.id);
        if (player) {
          this.matchmakingQueue = this.matchmakingQueue.filter(p => p.id !== socket.id);
          socket.emit('matchmaking_left', { message: 'Left matchmaking queue' });
        }
      });

      // Handle game moves
      socket.on('make_move', async (data: { gameId: string; move: any; timeLeft: number }) => {
        console.log('🎯 MAKE_MOVE event received:', JSON.stringify(data, null, 2));
        console.log('🎯 From player socket:', socket.id);
        try {
          const player = this.connectedUsers.get(socket.id);
          console.log('🎯 Player found:', player ? player.username : 'NOT FOUND');
          if (!player) {
            console.log('❌ User not authenticated in make_move');
            socket.emit('error', { message: 'User not authenticated' });
            return;
          }

          const game = this.activeGames.get(data.gameId);
          console.log('🎯 Game found:', game ? `${game.white.username} vs ${game.black.username}` : 'NOT FOUND');
          console.log('🎯 Active games count:', this.activeGames.size);
          if (!game) {
            console.log('❌ Game not found:', data.gameId);
            socket.emit('error', { message: 'Game not found' });
            return;
          }

          // Check if it's player's turn
          const isWhite = game.white.id === socket.id;
          const isBlack = game.black.id === socket.id;
          
          console.log(`🎯 Player turn validation:`, {
            socketId: socket.id,
            whiteId: game.white.id,
            blackId: game.black.id,
            isWhite,
            isBlack
          });
          
          if (!isWhite && !isBlack) {
            console.log(`❌ Player not in game: ${socket.id}`);
            socket.emit('error', { message: 'You are not a player in this game' });
            return;
          }

          const currentTurn = game.chess.turn();
          console.log(`🎯 Turn check:`, {
            currentTurn,
            isWhite,
            isBlack,
            shouldAllowMove: (currentTurn === 'w' && isWhite) || (currentTurn === 'b' && isBlack)
          });
          
          if ((currentTurn === 'w' && !isWhite) || (currentTurn === 'b' && !isBlack)) {
            console.log(`❌ Not player's turn: currentTurn=${currentTurn}, isWhite=${isWhite}, isBlack=${isBlack}`);
            socket.emit('invalid_move', { message: 'Not your turn' });
            return;
          }

          // Try to make the move
          try {
            console.log(`🎯 Attempting move validation:`, {
              move: data.move,
              currentPosition: game.chess.fen(),
              availableMoves: game.chess.moves({ verbose: true }).slice(0, 5) // First 5 moves for debugging
            });
            
            const move = game.chess.move(data.move);
            if (!move) {
              console.log(`❌ Move validation failed:`, {
                move: data.move,
                position: game.chess.fen(),
                turn: game.chess.turn(),
                allMoves: game.chess.moves()
              });
              socket.emit('invalid_move', { message: 'Invalid move' });
              return;
            }
            
            console.log(`✅ Move validated successfully:`, {
              move: data.move,
              san: move.san,
              newPosition: game.chess.fen()
            });

            // Update time
            const now = Date.now();
            const timeSpent = now - game.lastMoveTime;
            
            if (isWhite) {
              game.whiteTime = Math.max(0, data.timeLeft - timeSpent + (game.timeControl.increment * 1000));
            } else {
              game.blackTime = Math.max(0, data.timeLeft - timeSpent + (game.timeControl.increment * 1000));
            }
            
            game.lastMoveTime = now;

            // Initialize game result
            let gameResult: any = null;

            // ⏰ Check for timeout conditions
            if (game.whiteTime <= 0 && currentTurn === 'w') {
              console.log(`⏰ White time expired in game ${data.gameId}`);
              gameResult = {
                result: '0-1',
                reason: 'timeout',
                winner: 'black'
              };
              game.status = 'finished';
            } else if (game.blackTime <= 0 && currentTurn === 'b') {
              console.log(`⏰ Black time expired in game ${data.gameId}`);
              gameResult = {
                result: '1-0', 
                reason: 'timeout',
                winner: 'white'
              };
              game.status = 'finished';
            }

            // Check for game end (if not already ended by timeout)
            if (!gameResult && game.chess.isGameOver()) {
              if (game.chess.isCheckmate()) {
                gameResult = {
                  result: currentTurn === 'w' ? '0-1' : '1-0',
                  reason: 'checkmate',
                  winner: currentTurn === 'w' ? 'black' : 'white'
                };
              } else if (game.chess.isDraw()) {
                gameResult = {
                  result: '1/2-1/2',
                  reason: game.chess.isStalemate() ? 'stalemate' : 'draw',
                  winner: null
                };
              }
              game.status = 'finished';
            }

            // Broadcast move to all players in room
            const moveData = {
              move: data.move,
              san: move.san,
              position: game.chess.fen(),
              whiteTime: game.whiteTime,
              blackTime: game.blackTime,
              turn: game.chess.turn(),
              moveNumber: game.chess.moveNumber(),
              lastMove: data.move,
              gameResult
            };
            
            console.log(`🎯 Broadcasting move_made to room ${data.gameId}:`, moveData);
            console.log(`🎯 Room ${data.gameId} has ${this.io.sockets.adapter.rooms.get(data.gameId)?.size || 0} clients`);
            
            this.io.to(data.gameId).emit('move_made', moveData);
            
            console.log(`♟️  Move made in ${data.gameId}: ${move.san}`);

            if (gameResult) {
              console.log(`🏁 Game ended: ${data.gameId} - ${gameResult.result} (${gameResult.reason})`);
              // Clean up game after 30 seconds
              setTimeout(() => {
                this.activeGames.delete(data.gameId);
              }, 30000);
            }

          } catch (moveError) {
            socket.emit('invalid_move', { message: 'Invalid move format' });
          }

        } catch (error) {
          console.error('Move error:', error);
          socket.emit('move_error', { message: 'Failed to make move' });
        }
      });

      // Handle resignation
      socket.on('resign', async (data: { gameId: string }) => {
        const player = this.connectedUsers.get(socket.id);
        const game = this.activeGames.get(data.gameId);
        
        if (player && game) {
          const isWhite = game.white.id === socket.id;
          const winner = isWhite ? 'black' : 'white';
          const result = isWhite ? '0-1' : '1-0';
          
          game.status = 'finished';
          
          this.io.to(data.gameId).emit('game_ended', {
            result,
            winner,
            reason: 'resignation',
            resignedBy: player.username
          });

          console.log(`🏳️  ${player.username} resigned in game ${data.gameId}`);
          
          // Clean up game
          setTimeout(() => {
            this.activeGames.delete(data.gameId);
          }, 10000);
        }
      });

      // Handle joining existing games (as player or spectator)
      socket.on('join_game', (data: { gameId: string }) => {
        const player = this.connectedUsers.get(socket.id);
        const game = this.activeGames.get(data.gameId);
        
        console.log(`🎯 JOIN_GAME: ${player?.username} attempting to join ${data.gameId}`);
        
        if (player && game) {
          socket.join(data.gameId);
          console.log(`🎯 Socket ${socket.id} joined room ${data.gameId}. Room now has ${this.io.sockets.adapter.rooms.get(data.gameId)?.size || 0} clients`);
          
          // Check if user is a player in this game
          const isWhitePlayer = game.white.userId === player.userId;
          const isBlackPlayer = game.black.userId === player.userId;
          
          if (isWhitePlayer || isBlackPlayer) {
            // ✅ CRITICAL FIX: Update socket ID when player rejoins
            if (isWhitePlayer) {
              console.log(`🔄 Updating white player socket: ${game.white.id} -> ${player.id}`);
              game.white.id = player.id;
              game.white.socket = player.socket;
            }
            if (isBlackPlayer) {
              console.log(`🔄 Updating black player socket: ${game.black.id} -> ${player.id}`);
              game.black.id = player.id;
              game.black.socket = player.socket;
            }
            
            // User is a player - send game_started event
            socket.emit('game_started', {
              gameId: data.gameId,
              white: { 
                username: game.white.username, 
                rating: game.white.rating,
                userId: game.white.userId 
              },
              black: { 
                username: game.black.username, 
                rating: game.black.rating,
                userId: game.black.userId 
              },
              timeControl: game.timeControl,
              position: game.chess.fen(),
              whiteTime: game.whiteTime,
              blackTime: game.blackTime,
              turn: game.chess.turn(), // Add missing turn field!
              moveNumber: game.chess.moveNumber(),
              playerColor: isWhitePlayer ? 'white' : 'black' // CRITICAL FIX: Add playerColor
            });
            
            console.log(`🎮 ${player.username} rejoined game ${data.gameId} as ${isWhitePlayer ? 'white' : 'black'}`);
          } else {
            // User is a spectator
            game.spectators.push(player);
            
            socket.emit('spectating_started', {
              position: game.chess.fen(),
              whiteTime: game.whiteTime,
              blackTime: game.blackTime,
              players: {
                white: { username: game.white.username, rating: game.white.rating },
                black: { username: game.black.username, rating: game.black.rating }
              },
              moveHistory: game.chess.history({ verbose: true })
            });
            
            console.log(`👀 ${player.username} started spectating game ${data.gameId}`);
          }
        } else {
          socket.emit('game_not_found', { message: 'Game not found or already ended' });
        }
      });

      // Handle spectating (legacy - keeping for compatibility)
      socket.on('spectate_game', (data: { gameId: string }) => {
        const player = this.connectedUsers.get(socket.id);
        const game = this.activeGames.get(data.gameId);
        
        if (player && game) {
          socket.join(data.gameId);
          game.spectators.push(player);
          
          socket.emit('spectating_started', {
            position: game.chess.fen(),
            whiteTime: game.whiteTime,
            blackTime: game.blackTime,
            players: {
              white: { username: game.white.username, rating: game.white.rating },
              black: { username: game.black.username, rating: game.black.rating }
            },
            moveHistory: game.chess.history({ verbose: true })
          });
          
          console.log(`👀 ${player.username} started spectating game ${data.gameId}`);
        }
      });

      // Handle chat messages
      socket.on('chat_message', (data: { gameId: string; message: any }) => {
        const player = this.connectedUsers.get(socket.id);
        if (player && data.message && data.message.message && data.message.message.trim()) {
          this.io.to(data.gameId).emit('chat_message', {
            message: {
              username: data.message.username,
              message: data.message.message.trim(),
              timestamp: data.message.timestamp
            }
          });
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        const player = this.connectedUsers.get(socket.id);
        
        if (player) {
          console.log(`👋 User disconnected: ${player.username}`);
          
          // Remove from matchmaking queue
          this.matchmakingQueue = this.matchmakingQueue.filter(p => p.id !== socket.id);
          
          // Handle active games - for now just notify other players
          for (const [gameId, game] of this.activeGames.entries()) {
            if (game.white.id === socket.id || game.black.id === socket.id) {
              this.io.to(gameId).emit('player_disconnected', {
                username: player.username,
                message: `${player.username} disconnected`
              });
            }
            
            // Remove from spectators
            game.spectators = game.spectators.filter(spec => spec.id !== socket.id);
          }
          
          // Remove from connected users
          this.connectedUsers.delete(socket.id);
        }
      });
    });
  }

  // Public methods for stats
  public getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  public getActiveGamesCount(): number {
    return this.activeGames.size;
  }

  public getMatchmakingQueueCount(): number {
    return this.matchmakingQueue.length;
  }
}

let webSocketService: SimpleWebSocketService;

export const setupWebSocket = (server: HTTPServer): SimpleWebSocketService => {
  if (!webSocketService) {
    webSocketService = new SimpleWebSocketService(server);
  }
  return webSocketService;
};

export const getWebSocketService = (): SimpleWebSocketService => {
  return webSocketService;
};
