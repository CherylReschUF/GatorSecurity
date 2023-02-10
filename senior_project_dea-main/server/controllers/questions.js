require("../schemas")

const mongoose = require("mongoose")
const TraditionalQuestion = mongoose.model("TraditionalQuestionInfo")

const getCount = (async(req,res) =>{
    TraditionalQuestion.count().then((count)=>{
        res.send({status:"ok", data:count});
    })
    .catch((error)=>{
        res.send({status: "error", data:error});
    });
})

const getByTopic = (async(req,res)=>{
    //Check administrative status
    var isAdmin = false;

    try {
        if(req.body.token !== null && req.body.token !== undefined) {
            const adminFromToken = jwtObj.verify(req.body.token, Jwt_secret_Obj);
            const adminEmail = adminFromToken.email;
            var admin = await User.findOne({email: adminEmail});
            if(admin.isAdmin === true) {
                isAdmin = true;
            }
        }
    }
    catch(error) {
        res.send({status: 500, error:error});
        return;
    }
    
    try{
        //If url is /questions/get/all (more literally if :topic is equal to all)
		if(req.params.topic === "all") {
            //Retrieve all question data in database and send it
			TraditionalQuestion.find({}).then((data)=>{
                //Ensure answers aren't sent to the frontend unless you are an admin
                if(!isAdmin) {
                    for(let i = 0; i < data.length; i++) {
                        data[i].answer = "The answer is available only as an administrator.";
                    }
                }
				res.send({status:200, data:data});
			});
        //Else if the topic is a numerical id
		} else if(!isNaN(parseInt(req.params.topic))) {
            //Find specific question information in database and send it
			TraditionalQuestion.find({topic: req.params.topic}).then((data)=>{
                //Ensure answers aren't sent to the frontend unless you are an admin
                if(!isAdmin) {
                    for(let i = 0; i < data.length; i++) {
                        data[i].answer = "The answer is available only as an administrator.";
                    }
                }
				res.send({status:200, data:data});
			});
        //Else the topic is a string identifier
		} else {
            //Find specific question information in database and send it
			TraditionalQuestion.find({topic: questionTopicMap[req.params.topic]}).then((data)=>{
                //Ensure answers aren't sent to the frontend unless you are an admin
                if(!isAdmin) {
                    for(let i = 0; i < data.length; i++) {
                        data[i].answer = "The answer is available only as an administrator.";
                    }
                }
				res.send({status:200, data:data});
			});
		}
        //Catch any errors
        } catch(error) {
            //Send Status Code 500 (Internal Server Error)
            res.sendStatus(500);
        }
})

const deleteById = (async(req,res) => {
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

const update = (async(req,res) => {
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
        const result = await TraditionalQuestion.findByIdAndUpdate(_id, {
            //Dynamically changes values based on the JSON data in the PUT request
            question: req.body.question,
            type: req.body.type,
            topic: req.body.topic,
            options: req.body.options,
            answer: req.body.answer
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

const create = (async(req,res)=>{
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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const question = new TraditionalQuestion({
            //Dynamically changes values based on the JSON data in the POST request
            question: req.body.question,
            type: req.body.type,
            topic: req.body.topic,
            options: req.body.options,
            answer: req.body.answer,
        })
        await question.save();
        res.sendStatus(201);
    //Catch any errors
    } catch(error) {
        //Send Status Code 500 (Internal Server Error)
        res.sendStatus(500);
    }
})

module.exports = {
    getCount,
    getByTopic,
    deleteById,
    create,
    update
}