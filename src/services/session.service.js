const Session = require('../models/session.model');

const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

/**
 * Create a new game session
 */
const createSession = async (username) => {
  let code = generateCode();
  while (await Session.findOne({ code })) {
    code = generateCode();
  }

  const session = await Session.create({
    code,
    gameMaster: username,
    players: [{ username, socketId: '', isGameMaster: true }],
  });

  return session;
};

/**
 * Find a session by code
 */
const findSession = async (code) => {
  return Session.findOne({ code });
};

/**
 * Add a player to a session
 */
const addPlayer = async (session, username, socketId) => {
  const existing = session.players.find(p => p.username === username);
  if (existing) {
    existing.socketId = socketId;
  } else {
    session.players.push({ username, socketId, isGameMaster: false });
  }
  await session.save();
  return session;
};

/**
 * Remove a player from a session by socketId
 */
const removePlayer = async (session, socketId) => {
  session.players = session.players.filter(p => p.socketId !== socketId);
  await session.save();
  return session;
};

/**
 * Rotate game master to the next player
 */
const rotateGameMaster = async (session) => {
  const nonMasters = session.players.filter(p => !p.isGameMaster);
  if (nonMasters.length === 0) return session;

  session.players.forEach(p => p.isGameMaster = false);
  nonMasters[0].isGameMaster = true;
  session.gameMaster = nonMasters[0].username;
  session.status = 'waiting';
  session.question = null;
  session.answer = null;
  session.winner = null;
  session.players.forEach(p => { p.attempts = 0; p.hasGuessedCorrectly = false; });

  await session.save();
  return session;
};

/**
 * Delete a session by code
 */
const deleteSession = async (code) => {
  await Session.deleteOne({ code });
};

module.exports = { createSession, findSession, addPlayer, removePlayer, rotateGameMaster, deleteSession };