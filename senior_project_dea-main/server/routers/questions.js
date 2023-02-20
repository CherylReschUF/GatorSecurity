const express = require('express')
const router = express.Router()

const {
    getCount,
    getByTopic,
    deleteById,
    update,
    create
} = require('../controllers/questions.js')

const { validateQuestion } = require('../validators/questionValidator')

router.post('/getcount', getCount)

router.post('/get/:topic', getByTopic)

router.delete('/delete/:id', deleteById)

router.put('/update/:id', update)

router.post('/create', validateQuestion, create)

module.exports = router