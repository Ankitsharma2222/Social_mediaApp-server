const mongoose=require("mongoose")
const {ObjectId} = mongoose.Schema.Types

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    profilePic:{
        type:String,
        default:"https://icons8.com/icon/114007/customer"
    },
    followers:[
        {
            type:ObjectId,
            ref:"User"
        }
    ],
    following:[
        {
            type:ObjectId,
            ref:"User"
        }
    ]
},{
    timestamps:true
})
const User=mongoose.model('User',userSchema);
module.exports=User;