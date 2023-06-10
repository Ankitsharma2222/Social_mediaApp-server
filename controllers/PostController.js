const Post=require("../models/post")
const User=require("../models/user")
module.exports.CreatePost=(req,res)=>{
    const {title,body} = req.body 
    if(!title || !body){
      return  res.status(422).json({error:"Plase add all the fields"})
    }
    req.user.password=undefined;            // so that user password not show 
    const post = new Post({
        title,
        body,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})     
    })
    .catch(err=>{
        console.log(err)
    })
}



module.exports.getallPosts=(req,res)=>{
    Post.find()
    .populate("postedBy", "_id name")
    .then((posts)=>{
        return res.json({posts})
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