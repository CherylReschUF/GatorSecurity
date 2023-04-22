//Imports
require("../schemas")
const privileges = require("../util/privileges")

const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

//DB Models
const User = mongoose.model("UserInfo")
const TraditionalQuestion = mongoose.model("TraditionalQuestionInfo")

//ENV preparation
const dotenv = require("dotenv")
dotenv.config('./.env')

//JWT information
const jwtObj = require("jsonwebtoken");
const Jwt_secret_Obj = process.env.JWT_SECRET;

//Register endpoint controller
const register = (async (req, res) => {
    //Obtain user information
    const fname = req.body.fname.toString();
    const lname = req.body.lname.toString();
    const email = req.body.email.toString();
    const password = req.body.password.toString();
    const encryptedPass = await bcrypt.hash(password, 10);

    //Create the user as long as they have a unique email
    try {
        const existingUser = await User.findOne({email});

        //If user information already exists in database, return error
        if (existingUser) {
            return res.send({error: "A GatorSecurity account already exists with this email address."})
        }

        await User.create({
            fname,
            lname,
            email,
            password:encryptedPass,
        });
        res.send({status:"ok"});
        return;
    } catch(error) {
        res.send({status: "error"});
        return;
    }
})

//Login endpoint controller
const login = (async (req, res) => {
    //Obtain user information
    const email = req.body.email.toString();
    const password = req.body.password.toString();
    const user=await User.findOne({email});

    //If user information was not found, return error
    if (!user) {
        return res.json({error: "User email not found."});
    }

    //Attempt to login with provided credentials
    if (await bcrypt.compare(password, user.password)) {
        const tempToken = jwtObj.sign({email:user.email}, Jwt_secret_Obj);

        if (res.status(201)) {
            return res.json({status:"ok", data: tempToken});
        } else {
            return res.json({error:"error"});
        }
    }

    res.json({status:"error", error:"Invalid password."})
})

//Get user info endpoint controller
const getUserInfo = (async (req, res) => {
    //"Grab" token from request body (req.body)
    const {token} = req.body;
    try{
        //Decode token and get email
        const user = jwtObj.verify(token, Jwt_secret_Obj);
        const uEmail = user.email;
        //Find a user based on email and return the data
        User.findOne({email: uEmail}).then((data)=>{
            let allData = {dbUserData: data};
            res.send({status:"ok", data:allData});
        })
        .catch((error)=>{
            res.send({status: "error", data:error});
        });
    } catch(error) {
        return res.sendStatus(500);
    }
})

//Update user info endpoint controller
const updateUser = (async (req, res) => {
    try{
        //Set _id to the value given in url under :id
        const _id = req.params.id;

        //Hash the provided password
        if (req.body.password !== undefined) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        //Use provided email to find existing user in the database
        if (req.body.email !== undefined) {
            const email = req.body.email
            const existingUser = await User.findOne({email});

            //If another user besides the one we're updating has the same email
            if (existingUser && existingUser._id !== _id) {
                res.sendStatus(403);
                return;
            }
        }

        //Update user
        const result = await User.findByIdAndUpdate(_id, {
            $set: req.body
        });

        //If True
        if (result) {
            //Send Status Code 202 (Accepted)
            res.sendStatus(202);
            return;
        //Else False
        } else {
            //Send Status Code 404 (Not Found)
            res.sendStatus(404);
            return;
        }
    //Catch any errors
    } catch(error) {
        //Send Status Code 500 (Internal Server Error)
        res.sendStatus(500);
        return;
    }
})

//Get all users endpoint controller for the admin panel
const getAllUsers = (async (req, res) => {
    //Only allow access if the request has a valid admin token
    const admin = await privileges.isAdmin(req);

    if(Number(admin) === Number(1)) {
        //Fetch all users and send them back in the response
        try{
            User.find({}).then((data)=>{
                res.send(data);
            })
            .catch((error)=>{
                res.send({status: "error", data:error});
            });
        } catch(error) {
            res.sendStatus(500);
            return;
        }
    }
    else if(Number(admin) === Number(2)) {
        res.sendStatus(500);
        return;
    }
    else {
        res.sendStatus(403);
        return;
    }
})

//Check answer and update score endpoint controller for learn questions
const checkAnswerAndUpdateScore = (async (req, res) => {
    try{
        //Retrieve the question being answered
        const questionData = await TraditionalQuestion.findById(req.body.qid)

        //Check to see if they answered it correctly
        if(questionData.answer === req.body.answer) {
            const user = jwtObj.verify(req.body.token, Jwt_secret_Obj);
            const uEmail = user.email;

            //Get existing scores
            const dbUser = await User.findOne({email: uEmail});

            //Determine if this is a learn question or a fill in the blank game question
            if (questionData.displayType === 'learn') {
                //Update learn score
                let existingRawScores = dbUser["learnscore"];

                let existingScores = [];
                if(existingRawScores !== undefined) {
                    existingScores = existingRawScores;
                }
    
                //If an existing entry for the question is not found, add it
                if(existingScores.find(element => element === req.body.qid) === undefined) {
                    existingScores.push(req.body.qid);
                    await User.updateOne({email: uEmail}, {$set: {"learnscore": existingScores}});
                }
            }
            // displayType === 'game'
            else
            {
                //Update game score
                let existingRawScores = dbUser["gamescore"];

                let existingScores = [];
                if(existingRawScores !== undefined) {
                    existingScores = existingRawScores;
                }
    
                if(existingScores.find(element => element === req.body.qid) === undefined) {
                    existingScores.push(req.body.qid);
                    await User.updateOne({email: uEmail}, {$set: {"gamescore": existingScores}});
                }
            }
            res.send({status: 200, data:{correct:true, qid:req.body.qid}});
            return;
        } else {
            res.send({status: 200, data:{correct:false}});
            return;
        }
    } catch(error) {
		res.sendStatus(500);
        return;
    }
})

//Update score endpoint controller
const updateScore = (async (req,res) => {
    //For CYOA questions, we should score the question based on whether they got the whole thing correct,
    //so we only need to pass the parent question ID here to count it (along with the user token)
    try{
        //Obtain user
        const user = jwtObj.verify(req.body.token, Jwt_secret_Obj);
        const uEmail = user.email;

        const dbUser = await User.findOne({email: uEmail});

        //Update game score
        let existingRawScores = dbUser["gamescore"];

        let existingScores = [];
        if(existingRawScores !== undefined) {
            existingScores = existingRawScores;
        }

        if(existingScores.find(element => element === req.body.qid) === undefined) {
            existingScores.push(req.body.qid);
            await User.updateOne({email: uEmail}, {$set: {"gamescore": existingScores}});
        }

        res.sendStatus(204);
        return;
    }
    catch(error){
        res.sendStatus(500);
        return;
    }
})

//Check if a user is an admin endpoint controller
const checkPrivileges = (async (req, res) => {
    //Check administrative privileges
    const admin = await privileges.isAdmin(req);

    if(Number(admin) === Number(1)) {
        res.send({status: 200});
    }
    else if(admin === 2) {
        res.sendStatus(500);
        return;
    }
    else {
        res.sendStatus(403);
        return;
    }
})

//Exports
module.exports = {
    register,
    login,
    getUserInfo,
    updateUser,
    getAllUsers,
    checkAnswerAndUpdateScore,
    updateScore,
    checkPrivileges
}