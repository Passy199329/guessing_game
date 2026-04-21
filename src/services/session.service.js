const Session = require("../models/session.model");

/* CREATE SESSION */
const createSession = async function (userId) {
  return await Session.create({
    players: [
      {
        id: userId,
        score: 0,
        attempts: 3
      }
    ],
    gameMaster: userId,
    status: "waiting"
  });
};

/* JOIN SESSION (BLOCK IF ACTIVE) */
const joinSession = async function (sessionId, userId) {
  const session = await Session.findById(sessionId);

  if (!session) throw new Error("Session not found");

  if (session.status === "active") {
    throw new Error("Game already started");
  }

  const exists = session.players.find(p => p.id === userId);
  if (exists) return session;

  session.players.push({
    id: userId,
    score: 0,
    attempts: 3
  });

  return await session.save();
};

/* START GAME (ONLY GAME MASTER + MIN 2 PLAYERS) */
const startGame = async function (sessionId, question, answer) {
  const session = await Session.findById(sessionId);

  if (!session) throw new Error("Session not found");

  if (session.players.length < 2) {
    throw new Error("Need at least 2 players");
  }

  session.status = "active";
  session.question = question;
  session.answer = answer;

  return await session.save();
};

module.exports = {
  createSession,
  joinSession,
  startGame
};