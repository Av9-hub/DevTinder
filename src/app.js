const express=require('express');
const app=express(); //initializes a new instance of express application

app.post("/profile",(req,res)=>{
    res.send("Profile saved");
})

app.get("/user",(req,res)=>{
    console.log("hlw");
    res.send("Here is your data");
})

app.delete("/removeProfile",(req,res)=>{
    res.send("Your profile is removed");
})


app.listen(7777,()=>{
    console.log('server is running successfully on port 7777');
})


