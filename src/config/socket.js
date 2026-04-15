const gameSocket = require("../sockets/game.socket");

module.exports = (io) => {
  io.on("connection", (socket) => {
    gameSocket(io, socket);
  });
};