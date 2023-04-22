const mongoose = require("mongoose")

const userDBSchema = new mongoose.Schema(
    {
        fname:String,
        lname:String,
        email:{type:String, unique:true},
        password:String,
        learnscore: { type: Array, default: [0,0,0,0,0,0] },
        gamescore: { type: Array, default: [0,0,0,0,0] },
        admin:Boolean,
    },
    {
        collection: "UserInfo",
    }
);

mongoose.model("UserInfo", userDBSchema);