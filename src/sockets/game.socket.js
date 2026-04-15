const gameService = require("../services/game.service");
const Session = require("../models/session.model");

module.exports = (io, socket) => {

  socket.on("join_session", async ({ sessionId, userId }) => {
    const session = await Session.findById(sessionId);

    if (!session || session.status !== "waiting") {
      return socket.emit("error", "Cannot join");
    }

    socket.join(sessionId);

    io.to(sessionId).emit("player_joined", {
      userId,
      totalPlayers: session.players.length,
    });
  });

  socket.on("send_message", ({ sessionId, userId, message }) => {
    io.to(sessionId).emit("receive_message", {
      userId,
      message,
    });
  });

  socket.on("send_guess", async (data) => {
    const result = await gameService.handleGuess({
      ...data,
      io,
    });

    socket.emit("guess_result", result);
  });
};