const cors = require("cors")
const express = require("express")
const dotenv = require("dotenv")

//Prepare environment file
dotenv.config('./.env')

//Create express.js server and configure
const server = express()
server.disable("x-powered-by")
server.use(cors());
server.use(express.json())
server.use(express.urlencoded({extended:true}))

//Import routes
const userRoutes = require('./routers/users')
const questionRoutes = require('./routers/questions')
const gameRoutes = require('./routers/games')

//Connect database
const connectDb = require('./database/conn')
connectDb()

//Tell server to listen on port specified in ENV file
server.listen(process.env.LPORT, ()=>{
    console.log("Server started on port " + process.env.LPORT);
})

//Reveal uploaded CYOA and DND images
server.use(express.static('/uploads'))
server.use('/uploads/cyoa', express.static('./uploads/cyoa'))
server.use('/uploads/dnd', express.static('./uploads/dnd'))

//Use imported routes
server.use('/users', userRoutes)
server.use('/questions', questionRoutes)
server.use('/games', gameRoutes)
