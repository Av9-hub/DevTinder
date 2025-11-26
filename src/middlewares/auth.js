const jwt= require("jsonwebtoken");
const User=require("../models/user");
const userAuthCheck=async (req,res,next)=>{
    try{
    const {token}=req.cookies;
    if(!token){
        return res.status(401).send("Please Login");
    }
    const decodeData=jwt.verify(token,'DevTinder@123');
    const {_id}=decodeData;
    const user=await User.findById(_id);
    if(!user){
        throw new Error("User not found..");
    }
    req.user=user;
    next();
}
    catch(err){
        res.status(404).send("ERROR "+err.message);
    }
}

module.exports={
    userAuthCheck
}