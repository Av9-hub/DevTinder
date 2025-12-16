const User=require("../models/user")
const googleAuth=async(req,res)=>{
    try{
        const {email,name,picture,sub}=req.body;

        if(!email){
            return res.status(400).json({error:"Invalid Gmail User"});
        }
        const parts=name.split(" ");
        const firstName=parts[0];
        const lastName=parts[1]||"";
        let user=await User.findOne({gmail:email});
        let savedUser=user;
        if(!user){
            user=new User({
                firstName,
                lastName,
                gmail:email,
                image:picture,
                googleId:sub,       
            });
            savedUser=await user.save();
        }
        const token=await savedUser.JWTtoken();
         res.cookie("token",token,{expires:new Date(Date.now()+24*3600000)});
         res.json({message:"Data ",data:savedUser});
    }
    catch(err){
        res.status(404).send("ERROR! ",err);
    }
}

module.exports=googleAuth;