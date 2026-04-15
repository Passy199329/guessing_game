const { v4: uuidv4 } = require("uuid");

module.exports = (req, res, next) => {
  let userId = req.headers["x-user-id"];

  if (!userId) userId = uuidv4();

  req.user = { id: userId };
  next();
};