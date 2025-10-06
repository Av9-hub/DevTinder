const express=require('express');
const app=express(); //initializes a new instance of express application

app.use("/",[(req,res,next)=>{
    //Middlewares
    // res.send("hey");
    next();
}],
(req,res,next)=>{
    next();
    console.log("2nd console");
},
(req,res,next)=>{
    next();
}
);

//must have a matching path to "/user" to work on next of middlewares
//route handlers are those which actually sending response
//route "/" giving error to client because not getting route handler

app.use("/user",(req,res,next)=>{
    //request handler
    console.log("separe console");
    res.send("separete respond");
})



app.listen(7777,()=>{
    console.log('server is running successfully on port 7777');
})


