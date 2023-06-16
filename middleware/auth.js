const jwt=require("jsonwebtoken")
const User=require("../models/user")
const {JWT_KEY}=require("../keys")
const auth=(req,res,next)=>{
    const {authorization}= req.headers ;
    if(!authorization){
        return res.status(401).json({error:"Login to view this page"})
    }
    const token= authorization.replace("Bearer ","");
    jwt.verify(token , JWT_KEY,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"You are not authorized"})
        }
        const {_id}=payload;
        User.findById(_id).then((userdata)=>{
            req.user=userdata;
            next();
        })
    })
}
module.exports=auth;