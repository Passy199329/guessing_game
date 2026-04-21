const gameService = require("../services/game.service");
const timer = require("../utils/timer");

module.exports = function (io) {

  io.on("connection", function (socket) {

    socket.on("join_session", function (data) {
      socket.join(data.sessionId);

      io.to(data.sessionId).emit("message", "Player joined");
    });

    socket.on("start_game", async function (data) {

      io.to(data.sessionId).emit("game_started", {
        question: data.question
      });

      timer.startTimer(
        data.sessionId,
        60,
        io,
        async function () {
          const result = await gameService.endGame(data.sessionId);

          io.to(data.sessionId).emit("game_ended", result);
        }
      );
    });

    socket.on("guess", async function (data) {

      const result = await gameService.handleGuess(
        data.sessionId,
        data.userId,
        data.guess
      );

      io.to(data.sessionId).emit("message", result.message || "Guess received");

      if (result.winner) {
        io.to(data.sessionId).emit("game_ended", result);
      }
    });

  });

};