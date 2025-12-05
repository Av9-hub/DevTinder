const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,"fistName is required"],
        minLength:2,
        maxLength:50,
        validate(val){
            if(!validator.isAlpha(val)){
                throw new Error("Must contain only letters");
            }
        }
    },
    lastName:{
        type:String,
        minLength:2,
        maxLength:50,
        validate(val){
            if(!validator.isAlpha(val)){
                throw new Error("Must contain only letters");
            }
        }
    },
    gmail:{
        type:String,
        required:[true,"gmail is required"],
        unique:true,
        trim:true,
        lowercase:true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error("Invalid Email "+val+" Enter a valid email");
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(val){
            if(!validator.isStrongPassword(val)){
                throw new Error(" Enter a strong password minLength:8. Contains alphaNumeric and symobols. ");
            }
        }
    },
    age:{
        type:Number,
        min:[18,'Must be at least 18, got {VALUE}']
    },
    gender:{
        type:String,
        enum:{
            values:["male","female","others"],
            message:`Not a valid value: {VALUE}`,
            
        }
        // validate(val){
        //     if(!["male","female","others"].includes(val)){
        //         throw new Error("Not valid gender");
        //     }
        // }
        
    },
    about:{
        type:String,
        default:"This is default about user. "
    },
    skills:{
        type:[String],

    },
    image:{
        type:String,
        default:"https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-circle-icon.png",
        validate(val){
            if(!validator.isURL(val)){
                throw new Error("Invalid URL "+val);
            }
        }
    },
    degree:{
        type:String,
        
    },
    isPremium:{
        type:Boolean,
        default:false,
    },
    membershipType:{
        type:String,
    }

},
{timestamps:true});

userSchema.methods.JWTtoken=async function (){
    const user=this;
    const token=await jwt.sign({_id:user._id},'DevTinder@123',{expiresIn: '7d'});
    return token;
}

userSchema.methods.isPassValid=async function(passwordByUser){
    const user=this;
    const {password}=user;
    const isPasswordValid=await bcrypt.compare(passwordByUser,password);
    return isPasswordValid;
}

module.exports= mongoose.model("User",userSchema); //First letter must be capital