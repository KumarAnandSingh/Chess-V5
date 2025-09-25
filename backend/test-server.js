const express = require('express');
const { createServer } = require('http');

const app = express();
const server = createServer(app);

// Basic endpoints
app.get('/', (req, res) => {
  res.json({
    status: 'Test Server Running',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 3002
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', healthy: true });
});

// Start server
const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log('🚀 Test Server running on port', PORT);
  console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
  console.log('📍 All env vars:', Object.keys(process.env).filter(k => k.includes('RAILWAY')));
});

module.exports = server;