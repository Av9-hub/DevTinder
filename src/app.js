const express=require('express');
const app=express(); //initializes a new instance of express application

app.use("/user",[(req,res,next)=>{
    //Middlewares
    console.log("route handler 1");
    next();
    console.log("middlware worked");
}],
(req,res,next)=>{
    console.log("route handler 2");
    // res.send("2nd respose");
    next();
},
(req,res,next)=>{
    console.log("3rd route handler");
    // res.send("3rd response");
    next();
}
);

//must have a matching path to "/user" to work on next of middlewares
//route handlers are those which actually sending response

app.use("/user/xyz",(req,res,next)=>{
    //request handler
    console.log("separe console");
    res.send("separete respond");
})

app.listen(7777,()=>{
    console.log('server is running successfully on port 7777');
})


