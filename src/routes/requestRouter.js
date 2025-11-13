const express=require('express')
const requestRouter=express.Router();
const {userAuthCheck}=require("../middlewares/auth")

requestRouter.get("/sendConnectionRequest",userAuthCheck,(req,res)=>{
    try{
        const {user}=req;
        res.send(user.firstName+" Sending connection request. ");
    }
    catch(err){
        res.status(400).send(err.message);
    }
})

module.exports=requestRouter;