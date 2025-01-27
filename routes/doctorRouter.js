const express = require('express');
const { index, show, storeDoctor, storeReview } = require('../controllers/doctorControllers');

const validateInput = require('../middlewares/validateInput');

const router = express.Router();

router.get('/', index);
router.get('/:id', show);

router.post('/', validateInput, storeDoctor);
router.post('/:id/review', storeReview);

module.exports = router;
