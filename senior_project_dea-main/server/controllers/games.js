require("../schemas")

const mongoose = require("mongoose")
const fs = require("fs")
const path = require("path")
const GameQuestion = mongoose.model("GameQuestionInfo")
const CYOAQuestion = mongoose.model("CYOAQuestionInfo")
const DNDQuestion = mongoose.model("DNDQuestionInfo")
const MatchingQuestion = mongoose.model("MatchingQuestionInfo")
const User = mongoose.model("UserInfo")
const jwtObj = require("jsonwebtoken");
const Jwt_secret_Obj = "sfhgfhgefugefyfeyf63r36737288gssfgusducb@#$&fvdhfdgfuf76";
const questionTopicMap = {other: 0, input_validation: 1, encoding_escaping: 2, xss: 3, sql_injection: 4, crypto: 5, auth: 6};

//Overarching Game Question Routes ==================================================
const getGameCount = (async(req,res) =>{
    GameQuestion.count().then((count)=>{
        res.send({status:"ok", data:count});
    })
    .catch((error)=>{
        res.send({status: "error", data:error});
    });
})

const getGameByTopic = (async(req,res) =>{
    try{
        //If the topic is all
		if(req.params.topic === "all") {
            //Retrieve all question data in database and send it
			GameQuestion.find({}).then((data)=>{
				res.send({status:200, data:data});
			});
        //Else if the topic is a numerical id
		} else if(!isNaN(parseInt(req.params.topic))) {
            //Find specific question information in database and send it
			GameQuestion.find({topic: req.params.topic}).then((data)=>{
				res.send({status:200, data:data});
			});
        //Else the topic is a string identifier
		} else {
            //Find specific question information in database and send it
			GameQuestion.find({topic: questionTopicMap[req.params.topic]}).then((data)=>{
				res.send({status:200, data:data});
			});
		}
    //Catch any errors
    } catch(error) {
        //Send Status Code 500 (Internal Server Error)
        res.sendStatus(500);
    }
})

const getGameByType = (async(req,res) =>{
    try{
        //Find the game question and send it
        GameQuestion.find({type: req.params.type}).then((data) =>{
            res.send({status:200, data:data});
        })
    //Catch any errors
    } catch(error) {
        //Send Status Code 500 (Internal Server Error)
        res.sendStatus(500);
    }
})

const getGameById = (async(req,res) =>{
    try{
        var id = mongoose.Types.ObjectId(req.params.id);

        //Find the game question and send it
        GameQuestion.findOne({_id: id}).then((data) =>{
            res.send({status:200, data:data});
        })
    //Catch any errors
    } catch(error) {
        //Send Status Code 500 (Internal Server Error)
        res.sendStatus(500);
    }
})

const deleteGameById = (async(req,res) =>{
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

    //Try these options
    try{
        //Set _id to the value given in url under :id
        const _id = req.params.id;

        const question = await GameQuestion.findById(_id);
        if(question.type === 0) {
            for(let subquestion of question.questionData) {
                //Remove any existing file
                fs.readdirSync(path.join(__dirname, '..', 'uploads', 'cyoa')).forEach(file => {
                    if(file.indexOf(subquestion.toString()) !== -1) {
                        fs.unlinkSync(path.join(__dirname, '..', 'uploads', 'cyoa', file));
                        return;
                    }
                })

                await CYOAQuestion.findByIdAndDelete(subquestion);
            }
        }
        else if(question.type === 1) {
            for(let subquestion of question.questionData) {
                //Remove any existing file
                fs.readdirSync(path.join(__dirname, '..', 'uploads', 'dnd')).forEach(file => {
                    if(file.indexOf(subquestion.toString()) !== -1) {
                        fs.unlinkSync(path.join(__dirname, '..', 'uploads', 'dnd', file));
                        return;
                    }
                })

                await DNDQuestion.findByIdAndDelete(subquestion);
            }
        }
        else if(question.type !== 2) {
            res.send({status:500, error:"Cannot delete a question with a malformed type."});
            return;
        }

        //Set result to true or false depending on if the question 
        //was successfully found and deleted by its id
        const result = await GameQuestion.findByIdAndDelete(_id);
        
        //Find all users with references to the old questions and delete the old questions
        const usersWithOldQuestions = await User.find({gamescore: _id});
        for(let i = 0; i < (await usersWithOldQuestions).length; i++) {
            var user = usersWithOldQuestions[i];
            var index = user.gamescore.indexOf(_id);
            if(index > -1) {
                user.gamescore.splice(index, 1);
                await User.findOneAndUpdate({_id: user._id}, {$set: {gamescore:user.gamescore}});
            }
        }

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
        res.send({status: 500, error:error});
    }
})

const updateGame = (async(req,res) =>{
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

    try{
        //Set _id to the value given in url under :id
        const _id = req.params.id;

        //Set result to true or false depending on if the question was 
        //successfully found by its id and updated
        const result = await GameQuestion.findByIdAndUpdate(_id, {
            //Dynamically changes values based on the JSON data in the PUT request
            topic: req.body.topic,
            name: req.body.name,
            //NOTE: do not ever allow for the update of type here. Instead, delete the question and remake it.
            //NOTE: do not ever allow for the direct update of questionData. Instead, let the CYOA, DND, etc. routes handle it.
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

//Requires a token, questionIds (for a CYOA question), type, and topic
const createGame = (async(req,res) =>{
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
    try{
        const question = new GameQuestion({
            //Dynamically changes values based on the JSON data in the POST request
            //CHOOSE YOUR OWN ADVENTURE QUESTION DATA FORMAT: questionData contains a list of IDs to CYOA questions
            questionData: [],
            type: req.body.type,
            name: req.body.name,
            topic: req.body.topic,
        })
        await question.save();
        res.sendStatus(201);

    //Catch any errors
    } catch(error) {
        //Send Status Code 500 (Internal Server Error)
        res.sendStatus(500);
        return;
    }
})

//CYOA Subquestion Routes ==================================================
const getCYOAById = (async(req,res) =>{
    try{
        var id = mongoose.Types.ObjectId(req.params.id);

        //Find the game question and send it
        CYOAQuestion.findOne({_id: id}).then((data) =>{
            //Find any existing file
            fs.readdirSync(path.join(__dirname, '..', 'uploads', 'cyoa')).forEach(file => {
                if(file.indexOf(id) !== -1) {
                    data.stimulus = file;
                    return;
                }
            })
            res.send({status:200, data:data});
        })
    //Catch any errors
    } catch(error) {
        //Send Status Code 500 (Internal Server Error)
        res.sendStatus(500);
    }
})

const deleteCYOAById = (async(req,res) =>{
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

    //Try these options
    try{
        //Set _id to the value given in url under :id
        const _id = req.params.id;

        const subquestion = await CYOAQuestion.findById(_id);
        const parentQuestion = await GameQuestion.findById(subquestion.parentQuestionId);
        var tempQuestionData = parentQuestion.questionData;
    
        //Remove the parent's reference to the child
        const indexToRemove = tempQuestionData.indexOf(_id);
        if(indexToRemove > -1) {
            tempQuestionData.splice(indexToRemove, 1);
        }

        await GameQuestion.findByIdAndUpdate(subquestion.parentQuestionId, {questionData: tempQuestionData});

        //Set result to true or false depending on if the question 
        //was successfully found and deleted by its id
        const result = await CYOAQuestion.findByIdAndDelete(_id);

        //Remove any existing file
        fs.readdirSync(path.join(__dirname, '..', 'uploads', 'cyoa')).forEach(file => {
            if(file.indexOf(_id.toString()) !== -1) {
                fs.unlinkSync(path.join(__dirname, '..', 'uploads', 'cyoa', file));
                return;
            }
        })

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

//NOTE: This request MUST be made as a multipart/form-data with zero or one files that is less than 16 MB.
const updateCYOA = (async(req,res) =>{
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
        res.send({status: 500, error:error + ": Error getting user data."});
        return;
    }

    try{
        //Set _id to the value given in url under :id
        const _id = req.params.id;

        var result = false;

        if(req.files != undefined && req.files.length === 1) {
            //Set result to true or false depending on if the question was 
            //successfully found by its id and updated
            result = await CYOAQuestion.findByIdAndUpdate(_id, {
                //Dynamically changes values based on the JSON data in the PUT request
                questionNumber: req.body.questionNumber,
                question: req.body.question,
                options: req.body.options,
                answer: req.body.answer,
                explanation: req.body.explanation,
                //stimulus: req.files[0].buffer, //If you'd like to store file contents in the database, uncomment this line.
                //NOTE: do not ever allow for the update of the parent question id. Instead, delete the subquestion and remake it under the correct parent.
            });

            //Remove any existing file
            fs.readdirSync(path.join(__dirname, '..', 'uploads', 'cyoa')).forEach(file => {
                if(file.indexOf(_id.toString()) !== -1) {
                    fs.unlinkSync(path.join(__dirname, '..', 'uploads', 'cyoa', file));
                    return;
                }
            })

            //Store file contents in the filesystem
            const dot = req.files[0].originalname.indexOf('.');
            const ext = req.files[0].originalname.substring(dot);
            fs.writeFileSync(path.join(__dirname, '..', 'uploads', 'cyoa', _id.toString() + ext), req.files[0].buffer, "binary");
        }
        else {
            //Set result to true or false depending on if the question was 
            //successfully found by its id and updated
            result = await CYOAQuestion.findByIdAndUpdate(_id, {
                //Dynamically changes values based on the JSON data in the PUT request
                questionNumber: req.body.questionNumber,
                question: req.body.question,
                type: req.body.type,
                options: req.body.options,
                answer: req.body.answer,
                explanation: req.body.explanation,
                //NOTE: do not ever allow for the update of the parent question id. Instead, delete the subquestion and remake it under the correct parent.
            });
        }

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
        res.send({status: 500, error: error + ": Error updating question data."})
        return;
    }
})

//NOTE: This request MUST be made as a multipart/form-data with one file that is less than 16 MB.
const createCYOA = (async(req,res) =>{
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
    try{
        const pid = mongoose.Types.ObjectId(req.body.parentQuestionId);

        //Verify that the parent question exists in GameQuestion
        const parentQuestion = await GameQuestion.findOne({_id: pid});

        if(parentQuestion === null || parentQuestion === undefined) {
            res.send({status: 404, error: "The parent question was not found in the database."});
            return;
        }
        else if(parentQuestion.type !== 0) {
            res.send({status: 400, error: "The parent question is not a CYOA question."});
            return;
        }

        const question = new CYOAQuestion({
            //Dynamically changes values based on the JSON data in the POST request
            parentQuestionId: pid,
            questionNumber: req.body.questionNumber,
            question: req.body.question,
            type: req.body.type,
            options: req.body.options,
            answer: req.body.answer,
            explanation: req.body.explanation,
        })
        await question.save();

        //Store file contents in the filesystem
        const dot = req.files[0].originalname.indexOf('.');
        const ext = req.files[0].originalname.substring(dot);
        fs.writeFileSync(path.join(__dirname, '..', 'uploads', 'cyoa', question._id.toString() + ext), req.files[0].buffer, "binary");
        
        var tempQuestionData = parentQuestion.questionData;
        tempQuestionData.push(question._id);

        await GameQuestion.findByIdAndUpdate(pid, {questionData: tempQuestionData});
        
        res.sendStatus(201);
    //Catch any errors
    } catch(error) {
        //Send Status Code 500 (Internal Server Error)
        res.send({status: 500, error: error})
        return;
    }
})

// takes a question id (as a param) and the selected answer (from the request body)
// will return 200 along with T/F if the question is found, otherwise 401
const checkCYOAAnswer = (async(req, res) => {
    try{
        const _id = req.params.id;
        const questionData = await CYOAQuestion.findById(_id)

        if (req.body.answer === questionData.answer){
            res.send({status:"ok", data:true});
        }
        else{
            res.send({status:"ok", data:false});
        }
    } catch(error) {
        res.sendStatus(401);
    }
})

//DND Subquestion Routes ==================================================
const getDNDById = (async(req,res) =>{
    try{
        var id = mongoose.Types.ObjectId(req.params.id);

        //Find the game question and send it
        DNDQuestion.findOne({_id: id}).then((data) =>{
            //Find any existing file
            fs.readdirSync(path.join(__dirname, '..', 'uploads', 'dnd')).forEach(file => {
                if(file.indexOf(id) !== -1) {
                    data.stimulus = file;
                    return;
                }
            })
            res.send({status:200, data:data});
        })
    //Catch any errors
    } catch(error) {
        //Send Status Code 500 (Internal Server Error)
        res.sendStatus(500);
    }
})

const deleteDNDById = (async(req,res) =>{
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

    //Try these options
    try{
        //Set _id to the value given in url under :id
        const _id = req.params.id;

        const subquestion = await DNDQuestion.findById(_id);
        const parentQuestion = await GameQuestion.findById(subquestion.parentQuestionId);
        var tempQuestionData = parentQuestion.questionData;

        //Remove the parent's reference to the child
        const indexToRemove = tempQuestionData.indexOf(_id);
        if(indexToRemove > -1) {
            tempQuestionData.splice(indexToRemove, 1);
        }

        await GameQuestion.findByIdAndUpdate(subquestion.parentQuestionId, {questionData: tempQuestionData});

        //Set result to true or false depending on if the question 
        //was successfully found and deleted by its id
        const result = await DNDQuestion.findByIdAndDelete(_id);

        //Remove any existing file
        fs.readdirSync(path.join(__dirname, '..', 'uploads', 'dnd')).forEach(file => {
            if(file.indexOf(_id.toString()) !== -1) {
                fs.unlinkSync(path.join(__dirname, '..', 'uploads', 'dnd', file));
                return;
            }
        })

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
        res.send({status: 500, error:error});
    }
})

const updateDND = (async(req,res) =>{
    //Check administrative status
    try {
        if(req.body.token === null || req.body.token === undefined) {
            res.send({status: 403, message: "Token was null or undefined"});
            return;
        }
        const adminFromToken = jwtObj.verify(req.body.token, Jwt_secret_Obj);
        const adminEmail = adminFromToken.email;
        var admin = await User.findOne({email: adminEmail});
        if(admin.isAdmin !== true) {
            res.send({status: 403, message: "User is not an admin"});
            return;
        }
    }
    catch(error) {
        res.send({status: 500, error:error + ": Error getting user data."});
        return;
    }

    try{
        //Set _id to the value given in url under :id
        const _id = req.params.id;

        var result = false;

        if(req.files != undefined && req.files.length === 1) {
            //Set result to true or false depending on if the question was 
            //successfully found by its id and updated
            result = await DNDQuestion.findByIdAndUpdate(_id, {
                //Dynamically changes values based on the JSON data in the PUT request
                question: req.body.question,
                answer: req.body.answer,
                explanation: req.body.explanation,
                //NOTE: do not ever allow for the update of the parent question id. Instead, delete the subquestion and remake it under the correct parent.
            });

            //Remove any existing file
            fs.readdirSync(path.join(__dirname, '..', 'uploads', 'dnd')).forEach(file => {
                if(file.indexOf(_id.toString()) !== -1) {
                    fs.unlinkSync(path.join(__dirname, '..', 'uploads', 'dnd', file));
                    return;
                }
            })

            //Store file contents in the filesystem
            const dot = req.files[0].originalname.indexOf('.');
            const ext = req.files[0].originalname.substring(dot);
            fs.writeFileSync(path.join(__dirname, '..', 'uploads', 'dnd', _id.toString() + ext), req.files[0].buffer, "binary");
        }
        else {
            //Set result to true or false depending on if the question was 
            //successfully found by its id and updated
            result = await DNDQuestion.findByIdAndUpdate(_id, {
                //Dynamically changes values based on the JSON data in the PUT request
                question: req.body.question,
                answer: req.body.answer,
                explanation: req.body.explanation,
                //NOTE: do not ever allow for the update of the parent question id. Instead, delete the subquestion and remake it under the correct parent.
            });
        }

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
        res.send({status: 500, error: error + ": Error updating question data."})
        return;
    }
})

const createDND = (async(req,res) =>{
    try {
        //Perform file checks that can't be done in express validator
        for(let i = 0; i < req.files.length; i++) {
            const dotIndex = req.files[i].originalname.indexOf(".")
            
            if(dotIndex === -1) {
                res.send({status: 400, error: "All provided image files must have an extension."});
            }

            const subs = req.files[0].originalname.substring(dotIndex + 1).toLowerCase()
            if(subs !== "png" && subs !== "jpg" && subs !== "jpeg" && subs !== "apng" && subs !== "avif" && subs !== "gif" && subs !== "svg" && subs !== "webp") {
                res.send({status: 400, error: "All provided files must be images"});
            }
        }
    }
    catch(error) {
        res.send({status: 500, error:error});
        return;
    }

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
    try{
        const pid = mongoose.Types.ObjectId(req.body.parentQuestionId);

        //Verify that the parent question exists in GameQuestion
        const parentQuestion = await GameQuestion.findOne({_id: pid});

        if(parentQuestion === null || parentQuestion === undefined) {
            res.send({status: 404, error: "The parent question was not found in the database."});
            return;
        }
        else if(parentQuestion.type !== 1) {
            res.send({status: 400, error: "The parent question is not a DND question."});
            return;
        }

        const question = new DNDQuestion({
            //Dynamically changes values based on the JSON data in the POST request
            parentQuestionId: pid,
            question: req.body.question,
            answer: req.body.answer,
            explanation: req.body.explanation,
        })
        await question.save();

        //Store file contents in the filesystem
        const dot = req.files[0].originalname.indexOf('.');
        const ext = req.files[0].originalname.substring(dot);
        fs.writeFileSync(path.join(__dirname, '..', 'uploads', 'dnd', question._id.toString() + ext), req.files[0].buffer, "binary");
        
        var tempQuestionData = parentQuestion.questionData;
        tempQuestionData.push(question._id);

        await GameQuestion.findByIdAndUpdate(pid, {questionData: tempQuestionData});
        
        res.sendStatus(201);
    //Catch any errors
    } catch(error) {
        //Send Status Code 500 (Internal Server Error)
        res.send({status: 500, error: error})
        return;
    }
})

//Matching Subquestion Routes ==================================================
const getMatchingById = (async(req,res) =>{
    try {
        var id = mongoose.Types.ObjectId(req.params.id);
        //Find the game question and send it
        MatchingQuestion.findOne({_id: id}).then((data) =>{
            res.send({status:200, data:data});
        })
    //Catch any errors
    } catch(error) {
        //Send Status Code 500 (Internal Server Error)
        res.sendStatus(500);
    }
})

const createMatching = (async(req,res) =>{
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
    try{
        const pid = mongoose.Types.ObjectId(req.body.parentQuestionId);

        //Verify that the parent question exists in GameQuestion
        const parentQuestion = await GameQuestion.findOne({_id: pid});

        if(parentQuestion === null || parentQuestion === undefined) {
            res.send({status: 404, error: "The parent question was not found in the database."});
            return;
        }
        else if(parentQuestion.type !== 2) {
            res.send({status: 400, error: "The parent question is not a Matching question."});
            return;
        }

        const question = new MatchingQuestion({
            //Dynamically changes values based on the JSON data in the POST request
            parentQuestionId: pid,
            content: req.body.content
        })
        await question.save();
        
        var tempQuestionData = parentQuestion.questionData;
        tempQuestionData.push(question._id);

        await GameQuestion.findByIdAndUpdate(pid, {questionData: tempQuestionData});
        
        res.sendStatus(201);
    //Catch any errors
    } catch(error) {
        //Send Status Code 500 (Internal Server Error)
        res.send({status: 500, error: error})
        return;
    }
})

module.exports = {
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
    checkCYOAAnswer,
    getDNDById,
    deleteDNDById,
    updateDND,
    createDND,
    getMatchingById,
    createMatching
}
