const express=require('express');
const connectDB=require('./config/database');
const app=express(); //initializes a new instance of express application
const User=require('./models/user');
const { validateSignUpData } = require('./utils/validation');
const bcrypt=require("bcrypt");
const validator=require("validator")
const cookieParser=require("cookie-parser");
const jwt=require("jsonwebtoken");


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
        else{
            const isPasswordValid=await bcrypt.compare(password,savedUser.password);
            if(!isPasswordValid){
                throw new Error("Invalid Password. ");
            }
            else{
                 const token=await jwt.sign({_id:savedUser._id},'DevTinder@123');
                res.cookie("token",token);
                res.send("Login Successful ");
            }
        }
        }
    catch(err){
        res.status(404).send("ERROR! "+err.message);
    } 
    
})

app.get("/profile",async(req,res)=>{
    const cookie=req.cookies;
    try{
        const {token}=cookie;
        const  decodedMessage=jwt.verify(token,'DevTinder@123');
        if(!decodedMessage){
            throw new Error("Invalid Token");
        }
        console.log(decodedMessage);
        const {_id}=decodedMessage;
        const user=await User.findById(_id);
        if(!user){
            throw new Error("User not found");
        }
        console.log(token);
        res.send(user);
    }
    catch(err){
        res.status(404).send("ERROR "+err)
    }
})

app.get("/user",async(req,res)=>{
    const userGmail=req.body.gmail;
    try{     
        // const users=await User.findOne({});  
        // if(users){
        // res.send(users);
        // }
        // else{
        //     res.status(404).send("Data not found");  
        // }  

        const users=await User.find({gmail:userGmail}); 
        if(users.length===0){
        res.status(404).send("Data not found");  
        }
        else{
        res.send(users);
        }
    }
    catch(err){
        res.status(404).send("Something went wrong"+err.message);
    } 
})

app.get("/feed",async (req,res)=>{
    try{
        const users=await User.find({});
        if(users.length){
            res.send(users);
        }
        else{
            res.status(404).send("No data found");
        }
    }
    catch(err){
        res.status(404).send("Something Went Wrong");
    }
})

app.delete("/user",async (req,res)=>{
    const userId=req.body.userId;
    console.log(userId);
    try{
        // const user=await User.findByIdAndDelete(userId);

        const user=await User.findOneAndDelete({_id:userId});
        res.send("Data deleted successfully");
    }
    catch(err){
        console.status(404).send("Something went wrong");
    }
})

app.patch("/user/:userId",async (req,res)=>{
    const userId=req.params?.userId;
    const data=req.body;
    
    try{
        const ALLOWED_UPDATES=[
        "userId",
        "image",
        "password",
        "age",
        "gender",
        "about",
        "skills",
        "degree"
    ];

    const isUpdateAllowed=Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k));
    if(!isUpdateAllowed){
        throw new Error("Update not allowed");
    }
    if(user.skills?.length>=10){
        throw new Error("Skill size must less then 10 allowed");
        }

    // const user=await User.findOneAndUpdate({_id:userId},data);
    const user=await User.findByIdAndUpdate(userId,data,{
        returnDocument:"before",
        runValidators:true});

    console.log(user);
    res.send("Data updated successfully");
    }
    catch(err){
        res.status(404).send("Something went wrong"+err.message);
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



