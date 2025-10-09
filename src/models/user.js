const mongoose=require('mongoose');

const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:2,
        maxLength:50,
    },
    lastName:{
        type:String,
        minLength:2,
        maxLength:50,
    },
    gmail:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        min:[18,'Must be at least 18, got {VALUE}']
    },
    gender:{
        type:String,
        validate(val){
            if(!["male","female","others"].includes(val)){
                throw new Error("Not valid gender");
            }
        }
        
    },
    about:{
        type:String,
        default:"This is default about user "
    },
    skills:{
        type:[String],

    },
    image:{
        type:String,
        default:"https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-circle-icon.png"
    },
    degree:{
        type:String,
        enum:["Btech","Mca"],
    }
},
{timestamps:true});

module.exports= mongoose.model("User",userSchema); //First letter must be capital