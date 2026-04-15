const Session = require("../models/session.model");
const gameService = require("./game.service");

const timers = new Map();

const createSession = async (userId) => {
  return await Session.create({
    players: [userId],
    gameMaster: userId,
  });
};

const joinSession = async (sessionId, userId) => {
  const session = await Session.findById(sessionId);

  if (!session) throw new Error("Session not found");
  if (session.status !== "waiting") throw new Error("Game started");

  if (!session.players.includes(userId)) {
    session.players.push(userId);
  }

  await session.save();
  return session;
};

const startGame = async ({ sessionId, question, answer, io }) => {
  const session = await Session.findById(sessionId);

  if (session.players.length < 3)
    throw new Error("Minimum 3 players");

  session.status = "in-progress";
  session.question = question;
  session.answer = answer;
  session.attempts = new Map();

  session.players.forEach((p) =>
    session.attempts.set(p.toString(), 0)
  );

  await session.save();

  io.to(sessionId).emit("game_started", { question });

  const timer = setTimeout(async () => {
    await gameService.endByTimeout(sessionId, io);
  }, 60000);

  timers.set(sessionId, timer);

  return session;
};

const rotateGameMaster = async (sessionId) => {
  const session = await Session.findById(sessionId);

  const i = session.players.findIndex(
    (p) => p.toString() === session.gameMaster.toString()
  );

  session.gameMaster =
    session.players[(i + 1) % session.players.length];

  await session.save();
};

module.exports = {
  createSession,
  joinSession,
  startGame,
  rotateGameMaster,
};