const express = require('express');
const {
  index,
  show,
  getDoctorsSpecializations,
  storeDoctor,
  storeReview,
} = require('../Controllers/doctorControllers');

//middleware validazione input
const validateInput = require('../middlewares/validateInput');

const rules = {
  firstName: {
    min: 3,
    max: 50,
  },
  lastName: {
    min: 3,
    max: 50,
  },
  email: {
    min: 3,
    max: 50,
    isRequired: ['@', '.'],
  },
  phone: {
    min: 3,
    max: 20,
    //controllo che solo il primo carattere sia un +
    startsWith: ['+'],
    specialCharacters: ['+'],
  },
  address: {
    min: 5,
    max: 255,
    startsWith: ['Via', 'Piazza'],
  },
};

const router = express.Router();

router.get('/specializations', getDoctorsSpecializations);

router.get('/', index);
router.get('/:id', show);

router.post('/', validateInput, storeDoctor);
router.post('/:id/review', storeReview);

module.exports = router;
