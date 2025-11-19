const mongoose=require("mongoose")


const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"   //reference to User collection
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["accepted","rejected","interested","ignored"],
            message:`enum validator failed. {VALUE} `
        }
    }
    
},{
    timestamps:true
})

connectionRequestSchema.index({fromUserId:1,toUserId:1});

connectionRequestSchema.pre("save",function(next){
    const connectionRequest=this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("Cant send connection to yourself..")
    }
    next();
})

const ConnectionSchemaModel= mongoose.model("ConnectionSchemaModel",connectionRequestSchema);
module.exports=ConnectionSchemaModel;

