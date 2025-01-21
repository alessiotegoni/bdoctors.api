const express = require('express')
const router = express.Router()
const { index, storeReview } = require('../Controllers/doctorControllers')

router.get('/', index)
router.post('/:id', storeReview)

module.exports = router
