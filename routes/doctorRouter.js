const express = require('express');
const {
  index,
  show,
  getDoctorsSpecializations,
  storeDoctor,
  storeReview,
  // getFilteredDoctors,
} = require('../Controllers/doctorControllers.js');

const router = express.Router();

router.get('/', index);
router.get('/:id', show);

router.get('/specializations', getDoctorsSpecializations);
// router.get('/:first_name?/:last_name?/:specializations?', getFilteredDoctors);

router.post('/', storeDoctor);
router.post('/:id/review', storeReview);

module.exports = router;
