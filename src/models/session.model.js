const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  username: { type: String, required: true },
  socketId: { type: String, default: '' },
  score: { type: Number, default: 0 },
  attempts: { type: Number, default: 0 },
  hasGuessedCorrectly: { type: Boolean, default: false },
  isGameMaster: { type: Boolean, default: false },
});

const sessionSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  status: { type: String, enum: ['waiting', 'active', 'ended'], default: 'waiting' },
  gameMaster: { type: String, required: true },
  question: { type: String, default: null },
  answer: { type: String, default: null },
  winner: { type: String, default: null },
  players: [playerSchema],
  startedAt: { type: Date, default: null },
  endedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);