const Session = require("../models/session.model");

/* HANDLE GUESS */
const handleGuess = async function (sessionId, userId, guess) {
  const session = await Session.findById(sessionId);

  if (!session) return null;

  if (session.status !== "active") return { message: "Game not active" };

  const player = session.players.find(p => p.id === userId);

  if (!player) return { message: "Player not found" };

  if (player.attempts <= 0) {
    return { message: "No attempts left" };
  }

  player.attempts -= 1;

  /* WIN CONDITION */
  if (guess === session.answer) {
    session.status = "ended";

    player.score += 10;

    await session.save();

    return {
      winner: userId,
      answer: session.answer
    };
  }

  await session.save();

  return {
    message: "Wrong answer",
    attemptsLeft: player.attempts
  };
};

/* END GAME ON TIMEOUT */
const endGame = async function (sessionId) {
  const session = await Session.findById(sessionId);

  if (!session) return;

  session.status = "ended";

  await session.save();

  return {
    answer: session.answer,
    winner: null
  };
};

module.exports = {
  handleGuess,
  endGame
};