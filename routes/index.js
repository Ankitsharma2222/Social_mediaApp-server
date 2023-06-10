const express=require('express')
const router=express.Router();
const User =require("../models/user")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const {JWT_KEY} =require("../keys")
const auth=require("../middleware/auth")
const PostController=require("../controllers/PostController")
router.get("/",(req,res)=>{
    console.log("Home page")
})

router.get("/photo",auth,(req,res)=>{
    res.json("Private photo");
})

router.post("/signup",(req,res)=>{
    const {name,email,password} =req.body;
    if( !name || !email || !password){
        return res.status(422).json({
            error:"Please fill the all feilds"
        })
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({message:"User is already registered"})
        }
            bcrypt.hash(password,12)
            .then((hashedpassword)=>{
                const user=new User({
                    name,
                    email,
                    password :hashedpassword,
                })
                user.save()
                .then(user=>{
                    res.status(200).json({message:"SignUp completed"})
                })
                .catch((err)=>{
                    console.log("Error h bhai" , err);
                })
            })

        
    })
    .catch((err)=>{
        console.log("Error h bro" ,err);
    })
})

router.post("/signin", (req,res)=>{
    const {email ,password} =req.body;
    if( !email || !password){
        return res.status(422).json({message:"Please enter the all fields"})
    }
    User.findOne({email :email})
    .then((user)=>{
        if(!user){
            return res.status(404).json({message:"Email or Password is incorrect"})
        }
        bcrypt.compare(password,user.password)
        .then((ismatched)=>{
            if(ismatched){
                // return res.status(200).json({message:"Yup signin successful"})
                const token=jwt.sign({_id:user._id},JWT_KEY);
                res.json(token)
            }
            else{
                return res.status(404).json({message:"Email or Password is incorrect"})
            }
        })
        .catch((err)=>{
            console.log("Error in signin" ,err);
        })
    })
})

router.post("/createpost",auth,PostController.CreatePost)
router.get("/allposts",auth, PostController.getallPosts)
router.get("/myposts",auth,PostController.getmyposts)

module.exports=router;