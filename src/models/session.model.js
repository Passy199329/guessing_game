const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  players: [{ type: String }],   // ✅ FIXED
  gameMaster: { type: String },  // ✅ FIXED
  status: { type: String, default: "waiting" },
  question: String,
  answer: String,
  winner: String,
  attempts: { type: Map, of: Number },
});

module.exports = mongoose.model("Session", sessionSchema);