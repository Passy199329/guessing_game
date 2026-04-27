const Session = require('../models/session.model');

/**
 * Set the question and answer for a session
 */
const setQuestion = async (session, question, answer) => {
  session.question = question.trim();
  session.answer = answer.trim().toLowerCase();
  await session.save();
  return session;
};

/**
 * Start the game session
 */
const startGame = async (session) => {
  session.players.forEach(p => {
    p.attempts = 0;
    p.hasGuessedCorrectly = false;
  });
  session.status = 'active';
  session.winner = null;
  session.startedAt = new Date();
  await session.save();
  return session;
};

/**
 * Process a player's guess
 * @returns {{ correct: boolean, attemptsLeft: number, allOut: boolean }}
 */
const processGuess = async (session, socketId, guess) => {
  const player = session.players.find(p => p.socketId === socketId);
  if (!player) throw new Error('Player not found');
  if (player.isGameMaster) throw new Error('Game master cannot guess');
  if (player.hasGuessedCorrectly) throw new Error('You already guessed correctly');
  if (player.attempts >= 3) throw new Error('No attempts remaining');

  player.attempts += 1;
  const correct = guess.trim().toLowerCase() === session.answer;

  if (correct) {
    player.hasGuessedCorrectly = true;
    player.score += 10;
    session.winner = player.username;
    session.status = 'ended';
    session.endedAt = new Date();
  }

  await session.save();

  // Check if all non-master players are out
  const activePlayers = session.players.filter(p => !p.isGameMaster);
  const allOut = activePlayers.every(p => p.attempts >= 3 || p.hasGuessedCorrectly);

  return {
    correct,
    player,
    attemptsLeft: 3 - player.attempts,
    allOut: !correct && allOut,
  };
};

/**
 * End the game session (timeout or all out)
 */
const endGame = async (session) => {
  session.status = 'ended';
  session.endedAt = new Date();
  await session.save();
  return session;
};

module.exports = { setQuestion, startGame, processGuess, endGame };