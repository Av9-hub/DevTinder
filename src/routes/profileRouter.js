const express=require('express')
const profileRouter=express.Router()
const {userAuthCheck}=require("../middlewares/auth")
const {validateEditProfileData}=require("../utils/validation")
const bcrypt=require("bcrypt");

profileRouter.get("/profile/view",userAuthCheck,async(req,res)=>{
    try{
        const user=req.user;
        res.send(user);
    }
    catch(err){
        res.status(404).send("ERROR "+err)
    }
})
profileRouter.patch("/profile/edit",userAuthCheck,async(req,res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Not valid field to edit");
    }
    const loggedInUser=req.user;
    Object.keys(req.body).forEach((key)=>loggedInUser[key]=req.body[key]);
    await loggedInUser.save();
    res.json({
        message:`${loggedInUser.firstName},your profile update successfull!!`,
        data:loggedInUser
    })
}
catch(err){
    res.status(404).send(`ERROR,${err.message}`);
}
})

profileRouter.patch("/profile/forgotPassword",userAuthCheck,async (req,res)=>{
    try{
    const user=req.user;
    const {oldPassword,newPassword}=req.body;
    const isPasswordValid=await user.isPassValid(oldPassword);
    if(!isPasswordValid){
        throw new Error("Enter valid password");
    }
    const newHashPassword=await bcrypt.hash(newPassword,10);
    user.password=newHashPassword;
    await user.save();
    res.send("Password updated successfully!!!!");
    }
    catch(err){
        res.status(404).send("ERROR! "+err.message);
    }

})

module.exports=profileRouter;