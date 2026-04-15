const sessionService = require("../services/session.service");

exports.createSession = async (req, res, next) => {
  try {
    const data = await sessionService.createSession(req.user.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.joinSession = async (req, res, next) => {
  try {
    const data = await sessionService.joinSession(
      req.params.id,
      req.user.id
    );
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.startGame = async (req, res, next) => {
  try {
    const data = await sessionService.startGame({
      ...req.body,
      io: req.app.get("io"),
    });

    res.json(data);
  } catch (error) {
    next(error);
  }
};