const express=require('express');
const app=express(); //initializes a new instance of express application

const {adminAuthCheck}=require('./middlewares/auth');
const {userAuthCheck}=require("./middlewares/auth")

app.use("/admin",adminAuthCheck);

app.get("/admin/getData",(req,res,next)=>{
        res.send("here is your data");
});

app.get("/admin/deleteData",(req,res,next)=>{
        res.send("Deleted data");
})

app.get("/user/getData",userAuthCheck,(req,res)=>{
    res.send("Here is user data");
})

app.listen(7777,()=>{
    console.log('server is running successfully on port 7777');
})


