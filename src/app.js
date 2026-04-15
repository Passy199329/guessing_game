const express = require("express");
const cors = require("cors");

const auth = require("./middlewares/auth.middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(auth);

app.use("/api/sessions", require("./routes/session.routes"));

module.exports = app;