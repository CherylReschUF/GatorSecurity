//Imports
require("../schemas")
const privileges = require("../util/privileges")

const mongoose = require("mongoose")

//DB Models
const TraditionalQuestion = mongoose.model("TraditionalQuestionInfo")
const User = mongoose.model("UserInfo")

//ENV preparation
const dotenv = require("dotenv")
dotenv.config('./.env')

//Topic map
const questionTopicMap = {other: 0, input_validation: 1, encoding_escaping: 2, xss: 3, sql_injection: 4, crypto: 5, auth: 6};

//Get count of all traditional learn questions in the database endpoint controller
const getCount = (async(req,res) =>{
    //Count learn questions and return the count in the response
    TraditionalQuestion.count({displayType:req.body.displayType.toString()}).then((count)=>{
        res.send({status:200, data:count});
        return;
    })
    .catch((error)=>{
        res.send({status:500, data:error});
        return;
    });
})

//Get traditional learn questions by topic endpoint controller
const getByTopic = (async(req,res)=>{
    //Check administrative status
    var isAdmin = await privileges.isAdmin(req);

    try{
        //If url is /questions/get/all (more literally if :topic is equal to all)
		if(req.params.topic === "all") {
            //Retrieve all question data in database and send it
			TraditionalQuestion.find({}).then((data)=>{
                //Ensure answers aren't sent to the frontend unless you are an admin
                if(Number(isAdmin) !== Number(1)) {
                    for(let i = 0; i < data.length; i++) {
                        data[i].answer = "The answer is available only as an administrator.";
                    }
                }
				res.send({status:200, data:data});
                return;
			});
        //Else if the topic is a numerical id
		} else if(!isNaN(parseInt(req.params.topic))) {
            //Find specific question information in database and send it
			TraditionalQuestion.find({topic: req.params.topic.toString(), displayType: req.body.displayType.toString()}).then((data)=>{
                //Ensure answers aren't sent to the frontend unless you are an admin
                if(Number(isAdmin) !== Number(1)) {
                    for(let i = 0; i < data.length; i++) {
                        data[i].answer = "The answer is available only as an administrator.";
                    }
                }
				res.send({status:200, data:data});
                return;
			});
        //Else the topic is a string identifier
		} else {
            //Find specific question information in database and send it
			TraditionalQuestion.find({topic: questionTopicMap[req.params.topic.toString()], displayType: req.body.displayType.toString()}).then((data)=>{
                //Ensure answers aren't sent to the frontend unless you are an admin
                if(Number(isAdmin) !== Number(1)) {
                    for(let i = 0; i < data.length; i++) {
                        data[i].answer = "The answer is available only as an administrator.";
                    }
                }
				res.send({status:200, data:data});
                return;
			});
		}
    //Catch any errors
    } catch(error) {
        //Send Status Code 500 (Internal Server Error)
        res.sendStatus(500);
        return;
    }
})

//Delete traditional question by id endpoint controller
const deleteById = (async(req,res) => {
    //Only allow access if the request has a valid admin token
    const admin = await privileges.isAdmin(req);

    if(Number(admin) === Number(2)) {
        res.sendStatus(500);
        return;
    }
    else if (Number(admin) !== Number(1)) {
        res.sendStatus(403);
        return;
    }

    //Try these options
    try{
        //Set _id to the value given in url under :id
        const _id = req.params.id;
        //Set result to true or false depending on if the question 
        //was successfully found and deleted by its id
        const result = await TraditionalQuestion.findByIdAndDelete(_id);
        
        //Find all users with references to the old questions and delete the old questions
        const usersWithOldQuestions = await User.find({learnscore: _id});
        for(let i = 0; i < (await usersWithOldQuestions).length; i++) {
            var user = usersWithOldQuestions[i];
            var index = user.learnscore.indexOf(_id);
            if(index > -1) {
                user.learnscore.splice(index, 1);
                await User.findOneAndUpdate({_id: user._id}, {$set: {learnscore:user.learnscore}});
            }
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
        res.sendStatus(500);
        return;
    }
})

//Update traditional question endpoint controller
const update = (async(req,res) => {
    //Only allow access if the request has a valid admin token
    const admin = await privileges.isAdmin(req);

    if(Number(admin) === Number(2)) {
        res.sendStatus(500);
        return;
    }
    else if (Number(admin) !== Number(1)) {
        res.sendStatus(403);
        return;
    }

    try{
        //Set _id to the value given in url under :id
        const _id = req.params.id;
        //Update the user information
        const result = await TraditionalQuestion.findByIdAndUpdate(_id, {
            question: req.body.question,
            type: req.body.type,
            topic: req.body.topic,
            options: req.body.options,
            answer: req.body.answer,
            displayType: req.body.displayType,
        });
        //If the operation was sucessful
        if (result) {
            //Send Status Code 202 (Accepted)
            res.sendStatus(202);
        //If the operation was not successful
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

//Create traditional question endpoint controller
const create = (async(req,res)=>{
    //Only allow access if the request has a valid admin token
    const admin = await privileges.isAdmin(req);

    if(Number(admin) === Number(2)) {
        res.sendStatus(500);
        return;
    }
    else if (Number(admin) !== Number(1)) {
        res.sendStatus(403);
        return;
    }

    //Create the learn question from data sent in the request
    try{
        const question = new TraditionalQuestion({
            question: req.body.question,
            type: req.body.type,
            topic: req.body.topic,
            options: req.body.options,
            answer: req.body.answer,
            displayType: req.body.displayType,
        })
        await question.save();
       
        res.sendStatus(201);
        return;
    //Catch any errors
    } catch(error) {
        //Send Status Code 500 (Internal Server Error)
        res.sendStatus(500);
        return;
    }
})

//Exports
module.exports = {
    getCount,
    getByTopic,
    deleteById,
    create,
    update
}