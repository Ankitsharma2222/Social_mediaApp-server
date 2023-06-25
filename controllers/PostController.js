const Post=require("../models/post")
const User=require("../models/user")
module.exports.CreatePost=(req,res)=>{
    console.log("hello");
    const {title,body , image} = req.body 
    if(!title || !body || !image){
      return  res.status(422).json({error:"Plase add all the fields"})
    }
    // req.user.password=undefined;            // so that user password not show 
    const post = new Post({
        title,
        body,
        image,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})     
    })
    .catch(err=>{
        console.log("Error in postcontroller" ,err)
    })
}



module.exports.getallPosts=(req,res)=>{
    Post.find()
    .populate("postedBy", "_id name")
    .populate("comments.commentBy","_id name")
    .then((posts)=>{
        if(posts){
            return res.json({posts})
        }
        else{
            return res.json("No posts")
        }
    })
    .catch((err)=>{
        console.log("error h post fetching me" , err);
    })
}


module.exports.myfollowingsPosts=(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy", "_id name")
    .populate("comments.commentBy","_id name")
    .then((posts)=>{
        if(posts){
            return res.json({posts})
        }
        else{
            return res.json("No posts")
        }
    })
    .catch((err)=>{
        console.log("error h post fetching me" , err);
    })
}

module.exports.getmyposts=(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy", " name")
    .then((myposts)=>{
        return res.json({myposts})
    })
    .catch((err)=>{
        console.log("error h post fetching me" , err);
    })   
}

module.exports.like=(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).then((result)=>{
        return res.json(result);
    })
    .catch((err)=>{
        return res.json({error:err})
    })
}
module.exports.unlike=(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).then((result)=>{
            return res.json(result);
        
    }).catch((err)=>{
        res.json({error:"Error h bhai" })
    })
}


module.exports.comment=(req,res)=>{
    console.log(req.body)
    const mycomment={
        text:req.body.text,
        commentBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:mycomment}
    },{
        new:true
    })
    .populate("comments.commentBy","_id name")
    .populate("postedBy","_id name")
    .then((result)=>{
            return res.json(result);
        
    }).catch((err)=>{
        res.json(err)
    })
}

module.exports.deletePost=(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .then((post)=>{
        if(post){
            if(post.postedBy._id.toString()===req.user._id.toString()){
                Post.deleteOne({_id:post._id})
                .then((result)=>{
                    return res.json({_id:post._id})
                })
                .catch(err=>{
                    console.log("Error h bhia deletePost me")
                    res.json(err);
                })
            }
            else{
                return res.status(403).json({error:"You are not authorized "})
            }
        }
    })
    .catch((err)=>{
        console.log(err);
        return res.json(err);
    })
}