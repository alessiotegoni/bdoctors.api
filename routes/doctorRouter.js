const express = require('express');
const { index, show, storeDoctor, storeReview } = require('../Controllers/doctorControllers');

const validateInput = require('../middlewares/validateInput');

const router = express.Router();

router.get('/', index);
router.get('/:id', show);

// router.get('/specializations', getDoctorsSpecializations);
// router.get('/:first_name?/:last_name?/:specializations?', getFilteredDoctors);

router.post('/', validateInput, storeDoctor);
router.post('/:id/review', validateInput, storeReview);

module.exports = router;
