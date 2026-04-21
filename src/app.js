const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// serve frontend
app.use(express.static(path.join(__dirname, "../public")));

// routes
app.use("/api/sessions", require("./routes/session.routes"));

// test route
app.get("/", function (req, res) {
  res.send("API is running...");
});

module.exports = app;