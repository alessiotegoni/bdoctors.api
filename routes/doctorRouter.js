const express = require("express");
const { index, show, getDoctorsSpecializations } = require("../controllers/doctorControllers");

const router = express.Router();

router.get("/specializations", getDoctorsSpecializations)

router.get("/", index);
router.get("/:id", show);


module.exports = router;
