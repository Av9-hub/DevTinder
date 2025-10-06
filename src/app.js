const express=require('express');
const app=express(); //initializes a new instance of express application

//ERROR HANDLING USING 2 METHODS 
app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send("Something wrong1");
    }
})

//try catch
app.use("/getUserdata",(req,res)=>{
    try{
        throw new Error("jhasjdsdc");
        res.send("userData");
    }
    catch(err){
        res.status(404).send("contact care");
    }
    
})

//using routes
app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send("Something wrong2");
    }
})

app.listen(7777,()=>{
    console.log('server is running successfully on port 7777');
})


