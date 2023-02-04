const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
dotenv.config()

const server = express()
const cors=require("cors")
server.use(cors());
server.use(express.json())
require("./schemas")
const jwtObj = require("jsonwebtoken");
const Jwt_secret_Obj = "sfhgfhgefugefyfeyf63r36737288gssfgusducb@#$&fvdhfdgfuf76";
const User = mongoose.model("UserInfo")
const TraditionalQuestion = mongoose.model("TraditionalQuestionInfo")
const mongoUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.pfxgixu.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(mongoUrl, {
    useNewUrlParser:true
})
.then(()=>{console.log("Connnected to database");
})
.catch(e=>console.log(e));

server.post("/register", async(req, res)=>{
    const {fname, lname, email, password, score} = req.body;

    const encryptedPass = await bcrypt.hash(password, 10);

    try{
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.send({error: "The email used already exists"})
        }
        await User.create({
            fname,
            lname,
            email,
            password:encryptedPass,
            score
        });
        res.send({status:"ok"})
    } catch(error){
        res.send({status: "error"});
    }
});


server.post("/login", async(req,res)=> {
    const {email, password} = req.body;

    const user=await User.findOne({email});

    if(!user){
        return res.json({error: "User not found. That email does not exist "});
    }

    if(await bcrypt.compare(password, user.password)){
        const tempToken = jwtObj.sign({email:user.email}, Jwt_secret_Obj);

        if(res.status(201)){
            return res.json({status:"ok", data: tempToken});
        }else{
            return res.json({error:"error"});
        }
    }
    res.json({status:"error", error:"Invalid password"})
    
})


server.post("/userInfo", async(req,res)=>{
    const {token} = req.body;
    console.log("hello")
    try{
        const user = jwtObj.verify(token, Jwt_secret_Obj);

        console.log(user)

        const uEmail = user.email;
        User.findOne({email: uEmail}).then((data)=>{
            res.send({status:"ok", data: data});
        })
        .catch((error)=>{
            res.send({status: "error", data:error});
        });
    } catch(error){
		res.sendStatus(500);
    }
})

server.post("/allUsers", async(req,res)=>{
    console.log("/allUsers")
    try{
        User.find({}).then((data)=>{
            res.send(data);
        })
        .catch((error)=>{
            res.send({status: "error", data:error});
        });
    } catch(error){
		res.sendStatus(500);
    }
})

server.put("/updatescore", async(req,res)=>{
    const {token,section,index} = req.body;
    console.log("/updatescore put called in server.js")
    try{
        const user = jwtObj.verify(token, Jwt_secret_Obj);
        const uEmail = user.email;
        let field = section + "score." + index;
        let updateQuery= {};
        updateQuery[field] = 1
        const result = await User.updateOne({email: uEmail}, {$set: updateQuery});
        console.log("result: ");
        console.log(result);
        
		res.sendStatus(200);
    } catch(error){
		res.sendStatus(500);
    }

})

server.post("/questions/create", async(req,res)=>{
    try{
        const question = new TraditionalQuestion({
            qbody: req.body.question,
            qtype: req.body.type,
            qtopic: req.body.topic,
            answers: req.body.options,
            correctans: req.body.answer,
        })
        await question.save();
        res.sendStatus(201);
    } catch(error){
        res.sendStatus(418);
    }
})

server.listen(5000, ()=>{
    console.log("Server started on port 5000");
})