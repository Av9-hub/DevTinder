const {Server} = require("socket.io");
const Chat=require("../models/chat")

const initializeSocket=(server)=>{
    const io=new Server(server,{
        cors:{
            origin:"http://localhost:5173",
        },
    });
    console.log("socket started");
    io.on("connection",(socket)=>{
        
        socket.on("joinChat",({firstName,userId,targetUserId})=>{
            const roomId=[userId,targetUserId].sort().join("$");
            console.log(firstName+" joined room: "+roomId);
            socket.join(roomId);
        });

        socket.on(
            "sendMessage",
                async({firstName,lastName,userId,targetUserId,text})=>{

                    try{
                        const roomId=[userId,targetUserId].sort().join("$");
                        let chat=await Chat.findOne({participants:{$all:[userId,targetUserId]}});
                        if(!chat){
                            chat=new Chat(
                                {
                                    participants:[userId,targetUserId],
                                    messages:[]
                                }
                            );
                        }
                        chat.messages.push({
                            senderId:userId,
                            text,
                        })
                       
                        await chat.save();
                        io.to(roomId).emit("messageReceived", {firstName,lastName,text });
                    }
                    catch(err){
                        console.log(err);
                    }
                });

        socket.on("disconnect",()=>{})
    })
}

module.exports=initializeSocket