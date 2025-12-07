require("dotenv").config();
const express=require('express');
const connectDB=require('./config/database');
const app=express(); //initializes a new instance of express application
const cookieParser=require("cookie-parser");

const paymentRouter=require('./routes/payment')
const authRouter=require("./routes/authRouter")
const profileRouter=require("./routes/profileRouter")
const requestRouter=require("./routes/requestRouter");
const userRouter = require('./routes/user');
const cors=require("cors")
const task=require("./utils/nodeCron")
const http= require("http");
const initializeSocket=require("./utils/socket");
const chatRouter = require("./routes/chat");


// var dynamicCorsOptions = function(req, callback) {
//   var corsOptions;
//   if (req.path.startsWith('/')) {
//     corsOptions = {
//       origin: 'http://localhost:5173', // Allow only a specific origin
//       credentials: true,            // Enable cookies and credentials
//     };
//   } else {
//     corsOptions = { origin: '*' };   // Allow all origins for other routes
//   }
//   callback(null, corsOptions);
// };

// app.use(cors(dynamicCorsOptions));
task.start();
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}));



app.use(express.json());
app.use(cookieParser());

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use("/",userRouter);
app.use("/",paymentRouter)
app.use("/",chatRouter);

const server=http.createServer(app);
initializeSocket(server);

connectDB()
    .then(()=>{
        console.log("Connected to DB");
        server.listen(process.env.PORT,()=>{
        console.log('server is running successfully on port 7777');
    })
    })
    .catch((err)=>{
        console.error("Database cant be coonected");
    })



