const express=require("express")
const userRouter=express.Router();
const {userAuthCheck}=require("../middlewares/auth")
const ConnectionRequest=require("../models/connectionRequest");
const User=require("../models/user");

const USER_BIO_STR="firstName lastName age skills about gender image"
userRouter.get("/user/requests/receieved",userAuthCheck,async (req, res)=>{
    try{
    const loggedInUser=req.user;
    
    const connectionRequests=await ConnectionRequest.find({
        toUserId:loggedInUser._id,
        status:"interested"
    }).populate("fromUserId",USER_BIO_STR);
    //["firstName","lastName","age","gender","about"]
    

    res.json({
        message:"Data successfully fetched",
        connectionRequests
    })}
    catch(err){
        req.statusCode(400).send("ERROR! "+err.message);
    }
})


// get kiske kiske sath connections hai
userRouter.get("/user/connections",userAuthCheck,async(req,res)=>{
    try{
        const loggedInUser=req.user;

    const connectionRequest=await ConnectionRequest.find({

        $or:[
            {fromUserId:loggedInUser._id},
            {toUserId:loggedInUser._id}
        ],
        status:"accepted"
    })
    .populate("fromUserId",USER_BIO_STR)
    .populate("toUserId",USER_BIO_STR);

    const data=connectionRequest.map(key=>{
        if(key.fromUserId._id.toString()===loggedInUser._id.toString()){
            return key.toUserId;
        }
        return key.fromUserId;
    }
        
    )
    res.json({data});
}
catch(err){
    res.status(404).send("ERROR!  "+err.message);
}
})

//Get feed of loggedInuser
userRouter.get("/feed",userAuthCheck,async (req,res)=>{
    try{
        const loggedInUser=req.user;
        //what not be in feed of loggedInUser
        //-Any type of status (interested to or from , ignored to or from, accepted to or from ,
        //  rejected to or from) to other user/by user

        const connectionRequests=await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideFromUser=new Set();
        connectionRequests.forEach(req=>{
            hideFromUser.add(req.fromUserId.toString());
            hideFromUser.add(req.toUserId.toString());
        })
        const data=await User.find({
            $and:[
                {_id:{$nin:[...hideFromUser]}},  //not in
                {_id:{$ne:[loggedInUser._id]}}  //not equal
            ]
        }).select(USER_BIO_STR);
        
        res.json({data});
    }
    catch(err){
        res.status(404).json({message:err.message});
    }
    
})


module.exports=userRouter;