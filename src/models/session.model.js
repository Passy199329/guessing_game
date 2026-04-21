const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  attempts: {
    type: Number,
    default: 3
  }
});

const sessionSchema = new mongoose.Schema(
  {
    players: [playerSchema],

    gameMaster: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["waiting", "active", "ended"],
      default: "waiting"
    },

    question: {
      type: String,
      default: null
    },

    answer: {
      type: String,
      default: null
    },

    winner: {
      type: String,
      default: null
    },

    startedAt: {
      type: Date,
      default: null
    },

    endsAt: {
      type: Date,
      default: null
    }

  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Session", sessionSchema);