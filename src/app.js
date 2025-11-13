const express=require('express');
const connectDB=require('./config/database');
const app=express(); //initializes a new instance of express application
const cookieParser=require("cookie-parser");

const authRouter=require("./routes/authRouter")
const profileRouter=require("./routes/profileRouter")
const requestRouter=require("./routes/requestRouter")

app.use(express.json());
app.use(cookieParser());

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);

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



