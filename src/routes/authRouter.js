const express=require('express')
const authRouter=express.Router()
const { validateSignUpData } = require('../utils/validation');
const validator=require("validator")
const User=require('../models/user');
const bcrypt=require("bcrypt");

//file name not need to be same as router name

authRouter.post("/signUp",async (req,res)=>{
    try{
        //validate data->CreateUser
        validateSignUpData(req);
        
        //deStructuring
        const {firstName,lastName,password,gmail}=req.body;

        //BECRYPT PASSWORD
        const bcryptPassword=await bcrypt.hash(password,10);

        // CREATING AN INSTANCE OF USER MODEL   
        console.log(bcryptPassword);

        //instance of User model
        const user=new User({
            firstName,lastName,gmail,password:bcryptPassword,
        })

        await user.save();
        res.send("Data saved successfully");
    }
    catch(err){
        res.status(404).send("ERROR! "+err.message);
    }
})

authRouter.post("/login",async (req,res)=>{
     const {gmail,password}=req.body;
    try{
        //VALIDATE GMAIL
        if(!validator.isEmail(gmail)){
            throw new Error("Enter a valid gmail.")
        }

        //Check Gmail in DB
        const savedUser=await User.findOne({gmail:gmail});
        if(!savedUser){
            throw new Error("Gmail not registered. ");
        }
            const isPasswordValid=await savedUser.isPassValid(password);
            if(!isPasswordValid){
                throw new Error("Invalid Password. ");
            }
                const token=await savedUser.JWTtoken();
                res.cookie("token",token,{expires:new Date(Date.now()+24*3600000),httpOnly:true});
                res.send("Login Successful ");
        
        }
    catch(err){
        res.status(404).send("ERROR! "+err.message);
    }     
})

authRouter.post("/logout",(req,res)=>{
    res.cookie("token",null,{expires:new Date(Date.now())});
    res.send("logout successfully..");
})



module.exports=authRouter;
