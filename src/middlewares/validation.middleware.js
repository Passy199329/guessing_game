module.exports = (req, res, next) => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({
      message: "Question and answer required",
    });
  }

  next();
};