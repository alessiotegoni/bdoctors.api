const express = require('express');
const router = express.Router();
const index = require('../Controllers/doctorControllers');

router.get('/', index);

module.exports = router;
