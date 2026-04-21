require("dotenv").config();

const http = require("http");
const app = require("./app");
const socketIO = require("socket.io");
const mongoose = require("mongoose");

const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: "*"
  }
});

require("./sockets/game.socket")(io);

const PORT = process.env.PORT || 5000;

/* ✅ CONNECT DB FIRST */
mongoose
  .connect(process.env.MONGO_URI)
  .then(function () {
    console.log("MongoDB connected ✔");

    server.listen(PORT, function () {
      console.log("Server running on port " + PORT);
    });
  })
  .catch(function (err) {
    console.log("MongoDB connection error:", err.message);
  });