const activeTimers = {};

/**
 * Start a countdown timer for a session
 * @param {string} code - Session code
 * @param {number} seconds - Duration in seconds
 * @param {function} onTick - Called every second with timeLeft
 * @param {function} onExpire - Called when timer reaches 0
 */
const startTimer = (code, seconds, onTick, onExpire) => {
  stopTimer(code); // clear any existing timer

  let timeLeft = seconds;

  activeTimers[code] = setInterval(() => {
    timeLeft--;
    if (onTick) onTick(timeLeft);

    if (timeLeft <= 0) {
      stopTimer(code);
      if (onExpire) onExpire();
    }
  }, 1000);
};

/**
 * Stop and clear a session timer
 * @param {string} code - Session code
 */
const stopTimer = (code) => {
  if (activeTimers[code]) {
    clearInterval(activeTimers[code]);
    delete activeTimers[code];
  }
};

/**
 * Format seconds into MM:SS
 * @param {number} seconds
 * @returns {string}
 */
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

module.exports = { startTimer, stopTimer, formatTime };