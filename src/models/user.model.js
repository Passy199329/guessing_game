const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  username: String,
  score: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", schema);