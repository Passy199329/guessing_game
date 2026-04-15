const Session = require("../models/session.model");
const User = require("../models/user.model");
const sessionService = require("./session.service");

exports.handleGuess = async ({ sessionId, userId, guess, io }) => {
  const session = await Session.findById(sessionId);

  if (!session || session.status !== "in-progress")
    return { message: "Game not active" };

  const attempts = session.attempts.get(userId) || 0;

  if (attempts >= 3) return { message: "No attempts left" };

  session.attempts.set(userId, attempts + 1);

  if (guess.toLowerCase() === session.answer.toLowerCase()) {
    session.status = "ended";
    session.winner = userId;

    await User.findByIdAndUpdate(userId, {
      $inc: { score: 10 },
    });

    await session.save();

    const users = await User.find({
      _id: { $in: session.players },
    });

    io.to(sessionId).emit("game_ended", {
      winner: userId,
      answer: session.answer,
    });

    io.to(sessionId).emit("score_update", users);

    await sessionService.rotateGameMaster(sessionId);

    return { message: "Correct 🎉" };
  }

  await session.save();
  return { message: "Wrong ❌" };
};

exports.endByTimeout = async (sessionId, io) => {
  const session = await Session.findById(sessionId);

  if (!session || session.status !== "in-progress") return;

  session.status = "ended";
  await session.save();

  io.to(sessionId).emit("game_ended", {
    winner: null,
    answer: session.answer,
  });

  await sessionService.rotateGameMaster(sessionId);
};

   