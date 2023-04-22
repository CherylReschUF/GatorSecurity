const express = require('express')
const router = express.Router()

//Import user controller functions
const {
    register,
    login, 
    getUserInfo,
    updateUser,
    getAllUsers,
    checkAnswerAndUpdateScore,
    checkPrivileges,
    updateScore
} = require('../controllers/users.js')

//Connect user controller functions to endpoints
//Overarching User Routes (NOTE: Each / should be preceded by /users when testing with Postman e.g. localhost:5000/users/register)

router.post('/register', register)

router.post('/login', login)

router.post('/userInfo', getUserInfo)

router.put('/update/:id', updateUser)

router.post('/allUsers', getAllUsers)

router.put('/updatelearnscore', checkAnswerAndUpdateScore);

router.post('/checkPrivileges', checkPrivileges)

router.post('/updateScore', updateScore)

module.exports = router