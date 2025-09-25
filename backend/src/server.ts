import app from './app';
import { createServer } from 'http';
import DatabaseService from './services/database';
import { setupWebSocket } from './services/simpleWebsocket'; // ✅ RE-ENABLED with piece movement fix

const PORT = process.env.PORT || 3000;
const server = createServer(app);

// Setup WebSocket server for real-time multiplayer - ✅ RE-ENABLED  
setupWebSocket(server);

// Graceful shutdown handling
const gracefulShutdown = (signal: string) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  server.close(async (err) => {
    if (err) {
      console.error('Error during server shutdown:', err);
      process.exit(1);
    }
    
    console.log('Server closed successfully.');
    
    // Close database connections
    try {
      await DatabaseService.disconnect();
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
    
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Handle process signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Connect to database
    await DatabaseService.connect();

    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Chess Academy API server running on port ${PORT}`);
      console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌍 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔗 API Health Check: http://localhost:${PORT}/health`);
        console.log(`📖 API Documentation: http://localhost:${PORT}/api/docs`);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default server;