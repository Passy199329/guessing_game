require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const connectDB = require("./config/db");
const socketConfig = require("./config/socket");

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// 👇 make io available in controllers
app.set("io", io);

socketConfig(io);

server.listen(process.env.PORT, () => {
  console.log("Server running");
});