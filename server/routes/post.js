const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const Post=require('../models/post')
 const checkAuth=require('../middleware/requirelogin');


router.post('/createpost',checkAuth,(req,res)=>{
    const {title,body}=req.body;
    if(!title||!body)
    {
        return  res.status(422).json({error:"Please  add all the fields"})  
    }
    else{
        req.user.password=undefined;
         const post=new Post({
             title:title,
             body:body,
             postedBy:req.user
         })
         post.save().then(result=>{
             res.json({post:result})
         })
         .catch(err=>{
             console.log(err);
         })
    }
})


router.get('/allposts',(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")
    .then(posts=>{
        res.json({posts:posts})
    })
    .catch(err=>{
        console.log(err);
    })
})

router.get('/myposts',checkAuth,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(mypost=>{
        res.status(200).json({mypost:mypost})
    })
    .catch(err=>{
        console.log(err);
    })

})
module.exports=router;