const validator=require("validator");
const validateSignUpData=(req)=>{
    const {firstName,lastName,gmail,password,skills}=req.body;
    if(!firstName||!lastName){
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail(gmail)){
        throw new Error("ERROR! Enter a valid gmail");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("ERROR! Enter a strong password. ");
    }
    else if(skills?.length>=10){
        throw new Error("Skill size must less then 10 allowed");
        }
}
const validateEditProfileData=(req)=>{

    const allowedUpdate=["firstName","lastName","gmail","gender","age","image","skills","about","degree"];
    const isAllowedField=Object.keys(req.body).every(field=>allowedUpdate.includes(field));
    return isAllowedField;
}

module.exports={
    validateSignUpData,
    validateEditProfileData
}