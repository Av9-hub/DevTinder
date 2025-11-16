const express=require('express')
const requestRouter=express.Router();
const {userAuthCheck}=require("../middlewares/auth")
const ConnectionRequest=require("../models/connectionRequest")
const User=require("../models/user");


requestRouter.get("/send/:status/:toUserId",userAuthCheck,async(req,res)=>{
    try{
        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;
        
        const allowedStatus=["interested","ignored"];
        if(!allowedStatus.includes(status)){
            return res
                .status(404)
                .json({message:"invalida status type "+status})
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

module.exports=requestRouter;