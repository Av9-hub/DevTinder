const mongoose=require('mongoose');

const connectDB=async ()=>{
    await mongoose.connect('mongodb+srv://abhiDev:qd7797bUpQl6E4bH@cluster0.upj06lk.mongodb.net/devTinder');
}

module.exports=connectDB;
