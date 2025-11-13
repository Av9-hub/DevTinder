const express=require('express')
const profileRouter=express.Router()
const {userAuthCheck}=require("../middlewares/auth")

profileRouter.get("/profile",userAuthCheck,async(req,res)=>{
    try{
        const user=req.user;
        res.send(user);
    }
    catch(err){
        res.status(404).send("ERROR "+err)
    }
})

module.exports=profileRouter;