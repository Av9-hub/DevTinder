const adminAuthCheck=(req,res,next)=>{
    const token="xyz";
    const adminAuth=token==="xyz";
    if(adminAuth){
        next();
    }
    else{
        res.status(404).send("admin not authenticated");
    }
}

const userAuthCheck=(req,res,next)=>{
    const token="xyz";
    const userAuth=token==="xyz";
    if(userAuth){
        next();
    }
    else{
        res.status(404).send("user not authenticated");
    }
}

module.exports={
    adminAuthCheck,
    userAuthCheck
}