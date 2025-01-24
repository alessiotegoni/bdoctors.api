const express = require("express");
const {
  index,
  show,
  storeDoctor,
  storeReview,
} = require("../controllers/doctorControllers.js");

const router = express.Router();

router.get("/", index);
router.get("/:id", show);

router.post("/", storeDoctor);
router.post("/:id/review", storeReview);

module.exports = router;
