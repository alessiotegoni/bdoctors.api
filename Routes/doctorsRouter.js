const express = require('express')
const router = express.Router()
const { index, show, storeReview, storeDoctor } = require('../Controllers/doctorControllers')

router.get('/', index)

router.post('/', storeDoctor)

router.get('/:id', show)

router.post('/:id', storeReview)

module.exports = router
