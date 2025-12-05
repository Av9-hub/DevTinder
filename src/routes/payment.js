const express=require("express");
const paymentRouter=express.Router();
const { instance: razorpayInstance } =require('../utils/razorpay')
const {userAuthCheck}=require("../middlewares/auth")
const Payment =require("../models/payment")
const {membershipAmount}=require("../utils/constant")
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils')
const User=require("../models/user")

paymentRouter.post("/payment/create",userAuthCheck ,async(req,res)=>{
    try{
        const {membershipType}=req.body;
        const {firstName,lastName,gmail}=req.user;
        const order=await razorpayInstance.orders.create({
            amount: membershipAmount[membershipType]*100,
            currency: "INR",
            receipt: "receipt#1",
            notes: {
                firstName,
                lastName,
                gmail,
                membershipType: membershipType,
            },
        })
        console.log(order);
       const payment=new Payment({
            userId:req.user._id,
            orderId:order.id,
            status:order.status,
            amount:order.amount,
            currency:order.currency,
            receipt:order.receipt,
            notes:order.notes,
       });

       const savedPayment=await payment.save();
       res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
    }
    catch(err){
        return res.status(500).json({ msg: err.message });
    }
})

paymentRouter.post("/payment/webhook",async(req,res)=>{
    try{
    console.log("Webhook called");
    const webhookSignature=req.get("X-Razorpay-Signature");
    console.log("webhookSignature",webhookSignature);
    const isWebhookSignValid=validateWebhookSignature(JSON.stringify(req.body), webhookSignature, process.env.RAZORPAY_WEBHOOK_SECRET);
    
    if(!isWebhookSignValid){
        return res.status(400).json({msg: "Webhook sign is not valid "});
    }
    const paymentDetail=req.body.payload.payment.entity;
    const payment=await Payment.findOne({orderId:paymentDetail.order_id});
    payment.status=paymentDetail.status;
    await payment.save();

    const user=await User.findOne({_id:payment.userId});
    user.isPremium=true;
    user.membershipType=payment.notes.membershipType;
    await user.save();

    // if(req.body.event=="payment.captured"){
    // }
    // if(req.body.event=="payment failed")
    // {}

    return res.status(200).json({ msg: "Webhook received successfully" });
}
catch(err){
    return res.status(500).json({msg:err.message});
}
})

paymentRouter.get("/premium/verify",userAuthCheck,async(req,res)=>{
    const user=req.user;
    if(user.isPremium){
        return res.json({isPremium:true})
    }
    return res.json({isPremium:false})
})

module.exports=paymentRouter;