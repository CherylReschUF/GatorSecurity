//Imports
const mongoose = require("mongoose")

//ENV preparation
const dotenv = require("dotenv")
dotenv.config('./.env')

//JWT information
const jwtObj = require("jsonwebtoken");
const Jwt_secret_Obj = process.env.JWT_SECRET;

//DB Models
const User = mongoose.model("UserInfo")

//Check administrative status of users
async function isAdmin(req)
{
    try {
        //Check for the token
        if(req.body.token === null || req.body.token === undefined) {
            return 0; //Not an admin if no token is provided
        }

        //Check the user in the database to verify they are an admin
        const adminFromToken = jwtObj.verify(req.body.token, Jwt_secret_Obj);
        const adminEmail = adminFromToken.email;

        let admin = await User.findOne({email: adminEmail});
        if(admin.isAdmin !== true) {
            return 0; //Not an admin if the database user is not an admin
        }
    }
    catch(error) {
        return 2; //Return special error code if there an internal server error
    }

    return 1; //If this point has been reached, the user is an admin
}

module.exports = { isAdmin };