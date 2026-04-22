const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* serve frontend */
app.use(express.static(path.join(__dirname, "../public")));

/* api routes */
app.use("/api/sessions", require("./routes/session.routes"));


app.use(function (req, res) {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});


module.exports = app;