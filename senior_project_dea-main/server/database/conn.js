const mongoose = require("mongoose")
const dotenv = require("dotenv")

//Prepare environment file and connection string
dotenv.config('./.env')
const mongoUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.pfxgixu.mongodb.net/?retryWrites=true&w=majority`

//Perform connection
const connectDb = async() =>
{
    mongoose.connect(mongoUrl, {
        useNewUrlParser:true
    })
    .then(()=>{console.log("Connnected to database");
    })
    .catch(e=>console.log(e));
} 

module.exports = connectDb