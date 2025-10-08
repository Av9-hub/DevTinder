const express=require('express');
const connectDB=require('./config/database');
const app=express(); //initializes a new instance of express application
const User=require('./models/user');

app.use(express.json());

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



