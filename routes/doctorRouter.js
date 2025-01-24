const express = require('express');
const {
  index,
  show,
  getDoctorsSpecializations,
  storeDoctor,
  storeReview,
} = require('../controllers/doctorControllers.js');

const router = express.Router();

router.get('/', index);
router.get('/:id', show);

router.get('/specializations', getDoctorsSpecializations);

router.post('/', storeDoctor);
router.post('/:id/review', storeReview);

module.exports = router;
