const timers = new Map();

const startTimer = function (sessionId, duration, io, onEnd) {
  let timeLeft = duration;

  const interval = setInterval(function () {
    timeLeft--;

    io.to(sessionId).emit("time_update", {
      timeLeft
    });

    if (timeLeft <= 0) {
      clearInterval(interval);

      io.to(sessionId).emit("time_up");

      if (onEnd) onEnd();
    }
  }, 1000);

  timers.set(sessionId, interval);
};

const stopTimer = function (sessionId) {
  if (timers.has(sessionId)) {
    clearInterval(timers.get(sessionId));
    timers.delete(sessionId);
  }
};

module.exports = {
  startTimer,
  stopTimer
};