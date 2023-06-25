const Post=require("../models/post")
const User=require("../models/user")


module.exports.getUser=(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
         Post.find({postedBy:req.params.id})
         .populate("postedBy","_id name")
         .then((posts)=>{
             res.json({user,posts})
         })
         .catch(err=>{
             return res.status(422).json({error:err})

         })

    }).catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
}


module.exports.unfollow =(req,res)=>{
    User.findByIdAndUpdate({_id:req.body.unfollowId},{
        $pull:{followers:req.user._id}
    },{
        new:true
    })
    .then((result)=>{
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
            
        },{new:true})
        .select("-password")
        .then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
    .catch(err=>{

        return res.status(422).json({error:err})
    })
    
}

module.exports.follow =(req,res)=>{
    User.findByIdAndUpdate({_id:req.body.followId},{
        $push:{followers:req.user._id}
    },{
        new:true
    })
    .then((result)=>{
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
            
        },{new:true})
        .select("-password")
        .then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
    .catch(err=>{

        return res.status(422).json({error:err})
    })
    
}