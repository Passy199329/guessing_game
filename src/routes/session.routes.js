const router = require("express").Router();
const controller = require("../controllers/session.controller");

router.post("/", controller.createSession);
router.post("/:id/join", controller.joinSession);

module.exports = router;