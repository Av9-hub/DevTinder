const express=require('express');
const app=express(); //initializes a new instance of express application

app.use((req,res)=>{
    res.send('Hello there! This is my first express app.');
})

app.use("/hlw",(req,res)=>{     //route
    res.send(' hlw?');
})
app.use("/help",(req,res)=>{     //route
    res.send(' whats your query?');
})

// app.use("/main/help",(req,res)=>{
//     res.send('c?');
// })

app.listen(7777,()=>{
    console.log('server is running successfully on port 7777');
})
