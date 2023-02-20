require("../schemas")

const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const User = mongoose.model("UserInfo")
const TraditionalQuestion = mongoose.model("TraditionalQuestionInfo")
const jwtObj = require("jsonwebtoken");
const Jwt_secret_Obj = "sfhgfhgefugefyfeyf63r36737288gssfgusducb@#$&fvdhfdgfuf76";

const register = (async (req, res) => {
    const {fname, lname, email, password, score} = req.body;

    const encryptedPass = await bcrypt.hash(password, 10);

    try{
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
        res.send({status:"ok"})
    } catch(error) {
        res.send({status: "error"});
    }
})

const login = (async (req, res) => {
    const {email, password} = req.body;
    const user=await User.findOne({email});

    //If user information was not found, return error
    if (!user) {
        return res.json({error: "User email not found."});
    }

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

const getUserInfo = (async (req, res) => {
    //"Grab" token from request body (req.body)
    const {token} = req.body;
    try{
        //Decode token, get email
        const user = jwtObj.verify(token, Jwt_secret_Obj);
        //Set uEmail to email
        const uEmail = user.email;
        //Find a user based on email, then send the data
        User.findOne({email: uEmail}).then((data)=>{
            var allData = {dbUserData: data};
            res.send({status:"ok", data:allData});
        })
        .catch((error)=>{
            res.send({status: "error", data:error});
        });
    } catch(error) {
        res.sendStatus(500);
    }
})

const updateUser = (async (req, res) => {
    try{
        //Set _id to the value given in url under :id
        const _id = req.params.id;

        if (req.body.password !== undefined) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        if (req.body.email !== undefined) {
            const email = req.body.email
            const existingUser = await User.findOne({email});

            //If another user besides the one we're updating has the same email
            if (existingUser && existingUser._id !== _id) {
                return res.sendStatus(422);
            }
        }

        const result = await User.findByIdAndUpdate(_id, {
            $set: req.body
        });

        //If True
        if (result) {
            //Send Status Code 202 (Accepted)
            res.sendStatus(202);
        //Else False
        } else {
            //Send Status Code 404 (Not Found)
            res.sendStatus(404);
        }
    //Catch any errors
    } catch(error) {
        //Send Status Code 500 (Internal Server Error)
        res.sendStatus(500);
    }
})

const getAllUsers = (async (req, res) => {
    //Check administrative status
    try {
        if(req.body.token === null || req.body.token === undefined) {
            res.send({status: 403});
            return;
        }
        const adminFromToken = jwtObj.verify(req.body.token, Jwt_secret_Obj);
        const adminEmail = adminFromToken.email;
        var admin = await User.findOne({email: adminEmail});
        if(admin.isAdmin !== true) {
            res.send({status: 403});
            return;
        }
    }
    catch(error) {
        res.send({status: 500, error:error});
        return;
    }

    //console.log("/allUsers")
    try{
        User.find({}).then((data)=>{
            res.send(data);
        })
        .catch((error)=>{
            res.send({status: "error", data:error});
        });
    } catch(error) {
		res.sendStatus(500);
    }
})

const updateLearnScore = (async (req, res) => {
    try{
        //Retrieve the question being answered
        const questionData = await TraditionalQuestion.findById(req.body.qid)

        //Check to see if they answered it correctly
        if(questionData.answer === req.body.answer) {
            const user = jwtObj.verify(req.body.token, Jwt_secret_Obj);
            const uEmail = user.email;

            //Get existing scores
            const dbUser = await User.findOne({email: uEmail});

            if (questionData.displayType === 'learn')
            {
                var existingRawScores = dbUser["learnscore"];

                var existingScores = [];
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
                var existingRawScores = dbUser["gamescore"];

                var existingScores = [];
                if(existingRawScores !== undefined) {
                    existingScores = existingRawScores;
                }
    
                if(existingScores.find(element => element === req.body.qid) === undefined) {
                    existingScores.push(req.body.qid);
                    await User.updateOne({email: uEmail}, {$set: {"gamescore": existingScores}});
                }
            }
            res.send({status: 200, data:{correct:true, qid:req.body.qid}});
        } else {
            res.send({status: 200, data:{correct:false}});
        }
    } catch(error) {
		res.sendStatus(500);
    }
})

// TODO: Deprecate
const updateScore = (async (req, res) => {
    const {token,section,index} = req.body;
    if(section === "learn"){
        res.sendStatus(301);
        return;
    }
    try{
        const user = jwtObj.verify(token, Jwt_secret_Obj);
        const uEmail = user.email;
        let field = section + "score." + index;
        let updateQuery= {};
        updateQuery[field] = 1
        const result = await User.updateOne({email: uEmail}, {$set: updateQuery});
		res.sendStatus(200);
    } catch(error) {
		res.sendStatus(500);
    }
})

const checkPrivileges = (async (req, res) => {
    //Check administrative status
    try {
        if(req.body.token === null || req.body.token === undefined) {
            res.send({status: 403});
            return;
        }
        const adminFromToken = jwtObj.verify(req.body.token, Jwt_secret_Obj);
        const adminEmail = adminFromToken.email;
        var admin = await User.findOne({email: adminEmail});
        if(admin.isAdmin !== true) {
            res.send({status: 403});
            return;
        }
        else {
            res.send({status: 200});
            return;
        }
    }
    catch(error) {
        res.send({status: 500, error:error});
        return;
    }
})

module.exports = {
    register,
    login,
    getUserInfo,
    updateUser,
    getAllUsers,
    updateLearnScore,
    updateScore,
    checkPrivileges
}