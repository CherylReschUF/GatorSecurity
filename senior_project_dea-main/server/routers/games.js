const express = require('express')
const multer = require('multer')

const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({storage: storage});

const {
    getGameCount,
    getGameByTopic,
    getGameByType,
    getGameById,
    deleteGameById,
    updateGame,
    createGame,
    getCYOAById,
    deleteCYOAById,
    updateCYOA,
    createCYOA,
    getDNDById,
    deleteDNDById,
    updateDND,
    createDND
} = require('../controllers/games.js')

//Overarching Game Question Routes
router.post('/getcount', getGameCount);

router.post('/getByTopic/:topic', getGameByTopic);

router.post('/getByType/:type', getGameByType);

router.post('/getById/:id', getGameById);

router.delete('/delete/:id', deleteGameById);

router.put('/update/:id', updateGame);

router.post('/create', createGame);

//CYOA Subquestion Routes
router.post('/cyoa/getById/:id', getCYOAById);

router.delete('/cyoa/delete/:id', deleteCYOAById);

router.put('/cyoa/update/:id', upload.any(), updateCYOA);

router.post('/cyoa/create', upload.any(), createCYOA);

//DND Subquestion Routes
router.post('/dnd/getById/:id', getDNDById);

router.delete('/dnd/delete/:id', deleteDNDById);

router.put('/dnd/update/:id', updateDND);

router.post('/dnd/create', createDND);

module.exports = router