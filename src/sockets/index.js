const sessionService = require('../services/session.service');
const { stopTimer } = require('../utils/timer');
const { registerGameEvents } = require('./game.socket');

const initSockets = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Connected: ${socket.id}`);

    // ── Join session ────────────────────────────────────────────
    socket.on('join_session', async ({ code, username }) => {
      if (!code || !username) return socket.emit('error', 'Code and username are required');

      try {
        const session = await sessionService.findSession(code);
        if (!session) return socket.emit('error', 'Session not found');
        if (session.status === 'active') return socket.emit('error', 'Game already in progress');
        if (session.status === 'ended') return socket.emit('error', 'Session has ended');

        const updated = await sessionService.addPlayer(session, username, socket.id);
        socket.join(code);
        socket.data = { code, username };

        socket.emit('joined', { session: updated, username });
        io.to(code).emit('player_update', {
          players: updated.players,
          message: `${username} joined the session`,
        });
      } catch (err) {
        socket.emit('error', err.message);
      }
    });

    // ── Disconnect ──────────────────────────────────────────────
    socket.on('disconnect', async () => {
      console.log(`🔌 Disconnected: ${socket.id}`);
      const { code, username } = socket.data || {};
      if (!code) return;

      try {
        const session = await sessionService.findSession(code);
        if (!session) return;

        const updated = await sessionService.removePlayer(session, socket.id);

        if (updated.players.length === 0) {
          stopTimer(code);
          await sessionService.deleteSession(code);
          console.log(`🗑️ Session ${code} deleted`);
          return;
        }

        io.to(code).emit('player_update', {
          players: updated.players,
          message: `${username} left the session`,
        });
      } catch (err) {
        console.error('Disconnect error:', err.message);
      }
    });

    // ── Delegate all game events to game.socket.js ──────────────
    registerGameEvents(io, socket);
  });
};

module.exports = { initSockets };