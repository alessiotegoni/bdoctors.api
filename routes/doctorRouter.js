const express = require("express");
const {
  index,
  show,
  getDoctorsSpecializations,
  storeDoctor,
  storeReview,
} = require("../controllers/doctorControllers");

const router = express.Router();

router.get("/specializations", getDoctorsSpecializations);

router.get("/", index);
router.get("/:id", show);

router.post("/", storeDoctor);
router.post("/reviews/:id", storeReview);

module.exports = router;
