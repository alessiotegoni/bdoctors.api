const express = require('express');

const {
  index,
  show,
  storeDoctor,
  storeReview,
} = require('../Controllers/doctorControllers');

const validateReview = require('../middlewares/validateReview');
const validateDoctor = require('../middlewares/validateDoctor');

const router = express.Router();

router.get('/', index);
router.get('/:id', show);

//post request
router.post('/', validateDoctor, storeDoctor);
router.post('/:id/review', validateReview, storeReview);

module.exports = router;
