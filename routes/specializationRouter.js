const express = require("express");
const {
  getDoctorsSpecializations,
} = require("../controllers/specializationControllers.js");

const router = express.Router();

router.get("/", getDoctorsSpecializations);

module.exports = router;
