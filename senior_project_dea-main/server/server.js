const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
dotenv.config()

const cors=require("cors")
const helmet = require("helmet");
let server = express()

server.use(helmet.hidePoweredBy());


const allowedOrigins = ["http://localhost:3000"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

server.use(cors(corsOptions));
server.use(express.json())
require("./userSchema")
const jwtObj = require("jsonwebtoken");
const Jwt_secret_Obj = "sfhgfhgefugefyfeyf63r36737288gssfgusducb@#$&fvdhfdgfuf76";
const User = mongoose.model("UserInfo")
const mongoUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.s2i3dum.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(mongoUrl, {
    useNewUrlParser:true
})
.then(()=>{console.log("Connnected to database");
})
.catch(e=>console.log(e));

server.post("/register", async (req, res) => {
    const { fname, lname, email, password, score, admin } = req.body;
  
    const encryptedPass = await bcrypt.hash(password, 10);
  
    try {
      const existingUser = await User.findOne({ email});
  
      if (existingUser) {
        return res.send({ error: "The email used already exists" });
      }
  
      const newUser = new User({
        fname,
        lname,
        email,
        password: encryptedPass,
        score,
        admin,
      });
  
      await newUser.save();
  
      res.send({ status: "ok" });
    } catch (error) {
      res.send({ status: "error" });
    }
  });


  server.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email});
  
      if (!user) {
        return res.json({ error: "User not found. That email does not exist " });
      }
  
      const passwordMatches = await bcrypt.compare(password, user.password);
  
      if (!passwordMatches) {
        return res.json({ status: "error", error: "Invalid password" });
      }
  
      const tempToken = jwtObj.sign({ email: user.email }, Jwt_secret_Obj);
  
      return res.json({ status: "ok", data: tempToken });
    } catch (error) {
      return res.json({ status: "error", error: error.message });
    }
  });


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
        
    } catch(error){

    }

})


server.listen(5000, ()=>{
    console.log("Server started on port 5000");
})