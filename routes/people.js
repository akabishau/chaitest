const express = require('express')
const router = express.Router()

const controller = require('../controllers/people')

router.route('/').get(controller.listPeople).post(controller.addPerson)
router.route('/:id').get(controller.singlePerson)

module.exports = router