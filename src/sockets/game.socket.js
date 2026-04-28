const sessionService = require('../services/session.service');
const gameService = require('../services/game.service');
const { startTimer, stopTimer } = require('../utils/timer');

const registerGameEvents = (io, socket) => {

  // ── Set question (game master) ──────────────────────────────────
  socket.on('set_question', async ({ code, question, answer }) => {
    if (!question?.trim()) return socket.emit('error', 'Question is required');
    if (!answer?.trim()) return socket.emit('error', 'Answer is required');

    try {
      const session = await sessionService.findSession(code);
      if (!session) return socket.emit('error', 'Session not found');

      const player = session.players.find(p => p.socketId === socket.id);
      if (!player?.isGameMaster) return socket.emit('error', 'Only the game master can set questions');

      await gameService.setQuestion(session, question, answer);

      socket.emit('question_set', { message: 'Question set! You can now start the game.' });
      io.to(code).emit('chat_message', {
        type: 'system',
        message: '📝 Game master has set a question. Get ready!',
      });
    } catch (err) {
      socket.emit('error', err.message);
    }
  });

  // ── Start game (game master) ────────────────────────────────────
  socket.on('start_game', async ({ code }) => {
    try {
      const session = await sessionService.findSession(code);
      if (!session) return socket.emit('error', 'Session not found');

      const player = session.players.find(p => p.socketId === socket.id);
      if (!player?.isGameMaster) return socket.emit('error', 'Only the game master can start the game');
      if (session.players.length < 2) return socket.emit('error', 'Need more than 2 players to start');
      if (!session.question || !session.answer) return socket.emit('error', 'Please set a question first');
      if (session.status === 'active') return socket.emit('error', 'Game already started');

      const started = await gameService.startGame(session);

      io.to(code).emit('game_started', {
        question: started.question,
        players: started.players,
        timeLimit: 60,
      });

      io.to(code).emit('chat_message', {
        type: 'system',
        message: `🎮 Game started! "${started.question}" — 60 seconds, 3 attempts each!`,
      });

      // Start countdown timer
      startTimer(
        code,
        60,
        (timeLeft) => io.to(code).emit('timer_tick', { timeLeft }),
        async () => {
          const s = await sessionService.findSession(code);
          if (s?.status === 'active') {
            await gameService.endGame(s);

            io.to(code).emit('game_over', {
              reason: 'timeout',
              answer: s.answer,
              players: s.players,
              message: `⏰ Time's up! The answer was: "${s.answer}"`,
            });

            const rotated = await sessionService.rotateGameMaster(s);
            io.to(code).emit('new_game_master', {
              gameMaster: rotated.gameMaster,
              players: rotated.players,
              message: `🎯 ${rotated.gameMaster} is the new game master!`,
            });
          }
        }
      );
    } catch (err) {
      socket.emit('error', err.message);
    }
  });

  // ── Player guess ────────────────────────────────────────────────
  socket.on('guess', async ({ code, guess }) => {
    if (!guess?.trim()) return socket.emit('error', 'Guess cannot be empty');

    try {
      const session = await sessionService.findSession(code);
      if (!session) return socket.emit('error', 'Session not found');
      if (session.status !== 'active') return socket.emit('error', 'Game is not active');

      const { correct, player, attemptsLeft, allOut } = await gameService.processGuess(
        session,
        socket.id,
        guess
      );

      // Broadcast guess to all players
      io.to(code).emit('chat_message', {
        type: 'guess',
        username: player.username,
        message: `${player.username} guessed: "${guess}"`,
      });

      if (correct) {
        stopTimer(code);
        io.to(code).emit('game_over', {
          reason: 'winner',
          winner: player.username,
          answer: session.answer,
          players: session.players,
          message: `🏆 ${player.username} guessed correctly and wins 10 points!`,
        });

        const rotated = await sessionService.rotateGameMaster(session);
        io.to(code).emit('new_game_master', {
          gameMaster: rotated.gameMaster,
          players: rotated.players,
          message: `🎯 ${rotated.gameMaster} is the new game master!`,
        });

      } else if (allOut) {
        stopTimer(code);
        await gameService.endGame(session);

        io.to(code).emit('game_over', {
          reason: 'all_out',
          answer: session.answer,
          players: session.players,
          message: `😔 All players used all attempts! The answer was: "${session.answer}"`,
        });

        const rotated = await sessionService.rotateGameMaster(session);
        io.to(code).emit('new_game_master', {
          gameMaster: rotated.gameMaster,
          players: rotated.players,
          message: `🎯 ${rotated.gameMaster} is the new game master!`,
        });

      } else {
        socket.emit('wrong_guess', {
          message: attemptsLeft > 0
            ? `❌ Wrong! ${attemptsLeft} attempt(s) left.`
            : `❌ No attempts remaining!`,
          attemptsLeft,
        });
      }
    } catch (err) {
      socket.emit('error', err.message);
    }
  });

  // ── Chat message ────────────────────────────────────────────────
  socket.on('chat', ({ code, message }) => {
    const { username } = socket.data || {};
    if (!message?.trim() || !username) return;
    io.to(code).emit('chat_message', {
      type: 'chat',
      username,
      message: message.trim(),
    });
  });
};

module.exports = { registerGameEvents };