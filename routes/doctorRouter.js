const express = require('express');
const {
  index,
  show,
  getDoctorsSpecializations,
  storeDoctor,
  storeReview,
  getFilteredDoctors,
} = require('../controllers/doctorControllers');

const router = express.Router();

router.get('/', index);
router.get('/specializations', getDoctorsSpecializations);

router.get('/:id', show);
router.get('/:first_name?/:last_name?/:specializations?', getFilteredDoctors);

router.post('/', storeDoctor);

router.post('/:id/review', storeReview);

module.exports = router;
