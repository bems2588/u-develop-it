const express = require('express');
const { append } = require('express/lib/response');
const router = express.Router();

router.use(require('./candidateRoutes'));

router.use(require('./partyRoutes'));

module.exports = router;

