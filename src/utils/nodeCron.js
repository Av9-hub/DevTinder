const cron=require("node-cron");
const {subDays,startOfDay, endOfDay} =require("date-fns");
const ConnectionRequest=require("../models/connectionRequest")
const sendEmail=require("../utils/sendEmail")

const task=cron.schedule('0 47 11 * * *',async()=>{
    try{
         const today=new Date();
        const yesterday=subDays(today,1);
        const startOfYesterday=startOfDay(yesterday);
        const endOfYesterday=endOfDay(yesterday);

        const yesterdayRequest=await ConnectionRequest.find({
            status:"interested",
            updatedAt:{$gte:startOfYesterday,$lt:endOfYesterday}
        }).populate("toUserId" ,"gmail");

        const uniqueGmail=[...new Set(yesterdayRequest.map(request=>request.toUserId.gmail))];
        
        for(const gmail of uniqueGmail){
            try{const email=await sendEmail.run("Request receieved (interested to you) "+gmail,"This person interested to you. Pending request since yesterday.. Please review it");
            console.log(email);
            }
            catch(err){
                console.error(err);
            }
        }
        }
        catch(err){
            console.error(err);
        }
   

})

module.exports=task;