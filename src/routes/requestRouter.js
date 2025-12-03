const express=require('express')
const requestRouter=express.Router();
const {userAuthCheck}=require("../middlewares/auth")
const ConnectionRequest=require("../models/connectionRequest")
const User=require("../models/user");
const sendEmail=require("../utils/sendEmail");

requestRouter.post("/request/send/:status/:toUserId",userAuthCheck,async(req,res)=>{
    try{
        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;
        
        const allowedStatus=["interested","ignored"];
        if(!allowedStatus.includes(status)){
            return res
                .status(404)
                .json({message:"invalid request "+status})
        }
        const toUser=await User.findById(toUserId);
        if(!toUser){
            return res.status(400).json({message:"User not found."})
        } 

        const existingConnectionRequest=await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        }) 
      
        if(existingConnectionRequest){   //&&status===(existingConnectionRequest.status
            return res.status(400).json({
                message:`Connection already exist.. `
            })
        }
   
        const connectionRequest=new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data=await connectionRequest.save();
        console.log(data);
        const emailRes=await sendEmail.run(
            "Friend request from"+req.user.firstName,
            req.user.firstName+", "+status+ " to "+toUser.firstName
        );
        console.log(emailRes);
        res.json({
            message:
            req.user.firstName+", "+status+ " to "+toUser.firstName,
            data
         })
    }
    catch(err){
        res.status(400).send(err.message);
    }
})

requestRouter.post("/request/review/:status/:requestId",userAuthCheck,async(req,res)=>{
    try{
    const {status,requestId}=req.params;
    const loggedInUser=req.user;
    const allowedStatus=["accepted","rejected"];
    if(!allowedStatus.includes(status)){
        return res.status(404).json({message:"Not Valid Status "+status})
    }

    const connectionRequest=await ConnectionRequest.findOne(
        {   _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested"
        }
    )
    if(!connectionRequest){
        return res.status(400).json({message:`No connection request data..`})
    }

    connectionRequest.status=status;
    const data=await connectionRequest.save();

    res.json({
        message:`Request status changed successfully.. `,
        data
    })}
    catch(err){
        res.status(400).send("ERROR! "+err.message);
    }
})

module.exports=requestRouter;