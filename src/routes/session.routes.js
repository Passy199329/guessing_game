const express = require('express');
const router = express.Router();
const { createSession, getSession } = require('../controllers/session.controller');

router.post('/', createSession);
router.get('/:code', getSession);

module.exports = router;