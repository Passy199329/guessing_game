const sessionService = require("../services/session.service");

const createSession = async function (req, res) {
  try {
    const session = await sessionService.createSession(req.body.userId);
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const joinSession = async function (req, res) {
  try {
    const session = await sessionService.joinSession(
      req.params.id,
      req.body.userId
    );
    res.json(session);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createSession: createSession,
  joinSession: joinSession
};