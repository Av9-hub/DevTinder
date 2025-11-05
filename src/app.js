const express=require('express');
const connectDB=require('./config/database');
const app=express(); //initializes a new instance of express application
const User=require('./models/user');
const { validateSignUpData } = require('./utils/validation');
const bcrypt=require("bcrypt");
const validator=require("validator")
const cookieParser=require("cookie-parser");
const jwt=require("jsonwebtoken");
const {userAuthCheck}=require("./middlewares/auth")

app.use(express.json());
app.use(cookieParser());

app.post("/signUp",async (req,res)=>{
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

app.post("/login",async (req,res)=>{
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

app.get("/profile",userAuthCheck,async(req,res)=>{
    try{
        const user=req.user;
        res.send(user);
    }
    catch(err){
        res.status(404).send("ERROR "+err)
    }
})

app.get("/sendConnectionRequest",userAuthCheck,(req,res)=>{
    try{
        const {user}=req;
        res.send(user.firstName+" Sending connection request. ");
    }
    catch(err){
        res.status(400).send(err.message);
    }
})

connectDB()
    .then(()=>{
        console.log("Connected to DB");
        app.listen(7777,()=>{
        console.log('server is running successfully on port 7777');
    })
    })
    .catch((err)=>{
        console.error("Database cant be coonected");
    })



