const express = require('express');
const router = express.Router();
const index = require('../Controllers/DoctorController');

router.get('/',index);

module.exports = router;