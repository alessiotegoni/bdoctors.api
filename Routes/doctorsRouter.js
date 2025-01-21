const express = require('express')
const router = express.Router()
const { index, show, storeReview } = require('../Controllers/doctorControllers')

router.get('/', index)

router.get('/:id', show)

router.post('/:id', storeReview)

module.exports = router
