const express = require("express");
const {
  index,
  show,
  getDoctorsSpecializations,
  storeDoctor,
  storeReview,
} = require("../Controllers/doctorControllers");

const router = express.Router();

router.get("/specializations", getDoctorsSpecializations);

router.get("/", index);
router.get("/:id", show);

router.post("/", storeDoctor);
router.post("/:id/review", storeReview);

module.exports = router;
