const express=require('express')
const router=express.Router();
const User =require("../models/user")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const {JWT_KEY} =require("../keys")
const auth=require("../middleware/auth")
const PostController=require("../controllers/PostController")
const UserController=require("../controllers/UserController")
router.get("/",(req,res)=>{
    console.log("Home page")
})

router.get("/photo",auth,(req,res)=>{
    res.json("Private photo");
})

router.post("/signup",(req,res)=>{
    const {name,email,password ,profilePic} =req.body;
    if( !name || !email || !password){
        return res.status(422).json({
            error:"Please fill the all feilds"
        })
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"User is already registered"})
        }
            bcrypt.hash(password,12)
            .then((hashedpassword)=>{
                const user=new User({
                    name,
                    email,
                    profilePic,
                    password :hashedpassword,
                })
                user.save()
                .then(user=>{
                    res.status(200).json({message:"SignUp completed"})
                })
                .catch((err)=>{
                    console.log("Error h bro " , err);
                })
            })

        
    })
    .catch((err)=>{
        console.log("Error h bhai " ,err);
    })
})

router.post("/signin", (req,res)=>{
    const {email ,password} =req.body;
    if( !email || !password){
        return res.status(422).json({error:"Please enter the all fields"})
    }

    User.findOne({email :email})
    .then((user)=>{
        if(!user){
            return res.status(404).json({error:"Email or Password is incorrect"})
        }
        bcrypt.compare(password,user.password)
        .then((ismatched)=>{
            if(ismatched){
                // return res.status(200).json({message:"Yup signin successful"})
                const token=jwt.sign({_id:user._id},JWT_KEY);
                const {_id,name,email,profilePic,followers,following}=user
                return res.json({token ,user:{_id,name,email,profilePic,followers,following}})
            }
            else{
                return res.status(404).json({error:"Email or Password is incorrect"})
            }
        })
        .catch((err)=>{
            console.log("Error in signin" ,err);
        })
    })
    .catch(err=>{
        return res.status(422).json({error:"Error h"})
    })
 
})

router.post("/createpost",auth,PostController.CreatePost)
router.get("/allposts",auth, PostController.getallPosts)
router.get("/myposts",auth,PostController.getmyposts)
router.put("/like",auth,PostController.like)
router.put("/unlike",auth,PostController.unlike)
router.put("/comment",auth,PostController.comment)
router.delete("/deletepost/:postId",auth ,PostController.deletePost)
router.get("/getUser/:id" ,auth ,UserController.getUser)
router.put("/unfollow",auth,UserController.unfollow)
router.put("/follow",auth,UserController.follow)
router.get("/myfollowingsposts" ,auth ,PostController.myfollowingsPosts)

module.exports=router;