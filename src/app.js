const express=require('express');
const connectDB=require('./config/database');
const app=express(); //initializes a new instance of express application
const User=require('./models/user');

app.use("/",express.json());

app.post("/signUp",async (req,res)=>{

    //console.log(req.body);
    // CREATING AN INSTANCE OF USER MODEL 
    const user=new User(req.body);

    //SAVING THE DATA TO THE DOCUMENTS
    try{
        await user.save();
        res.send("Data saved successfully");
    }
    catch(err){
        res.status(404).send("Problem in data saving"+err.message);
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



