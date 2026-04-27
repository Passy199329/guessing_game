const sessionService = require('../services/session.service');

// @desc  Create a new session (game master)
// @route POST /api/sessions
const createSession = async (req, res) => {
  const { username } = req.body;
  if (!username || !username.trim()) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const session = await sessionService.createSession(username.trim());
    res.status(201).json({ success: true, code: session.code, session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc  Get session by code
// @route GET /api/sessions/:code
const getSession = async (req, res) => {
  try {
    const session = await sessionService.findSession(req.params.code);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createSession, getSession };