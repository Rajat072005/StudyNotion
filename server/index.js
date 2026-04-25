import express from 'express';
const app = express();
import dotenv from "dotenv";
dotenv.config();

import userRoutes from "./routes/User.js";
import profileRoutes from "./routes/Profile.js";
import courseRoutes from "./routes/Course.js";
import paymentRoutes from "./routes/Payment.js";



const PORT = process.env.PORT || 4000 ;
//const connectDB = require('./server/config/db');
import {connectDB} from './config/database.js';
import { cloudinaryConnect } from "./config/cloudinary.js";
import cookieParser from 'cookie-parser';
import fileUpload from "express-fileupload";

import cors from "cors";

app.use(express.json());
app.use(cookieParser());


//database
connectDB();

app.use(
    cors({
        origin : "http://localhost:3000",
        credentials : true,
    })
);

app.use(
    fileUpload({
        useTempFiles : true,
        tempFileDir : "/tmp"
    })
);

cloudinaryConnect();

//routes
app.use("/api/v1/auth" , userRoutes);
app.use("/api/v1/profile" , profileRoutes);
app.use("/api/v1/course" , courseRoutes);
app.use("/api/v1/payment" , paymentRoutes);

app.get("/" , (req,res) => {
    return res.json({
        success : true,
        message : "your server up and running..."
    });
});

app.listen(PORT , () => {
    console.log(`app is listening at ${PORT}`);
})
