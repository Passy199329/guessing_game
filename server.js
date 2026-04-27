require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./src/config/db');
const { initSockets } = require('./src/sockets');

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' },
});

// Connect DB
connectDB();

// Init sockets
initSockets(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🎮 Guessing Game running on http://localhost:${PORT}`);
});