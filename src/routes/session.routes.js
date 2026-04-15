const router = require("express").Router();
const controller = require("../controllers/session.controller");
const validate = require("../middlewares/validation.middleware");

router.post("/", controller.createSession);
router.post("/:id/join", controller.joinSession);
router.post("/start", validate, controller.startGame);

module.exports = router;