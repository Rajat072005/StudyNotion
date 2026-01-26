const express = require('express');
const app = express();
require('dotenv').config();
const user = require('./routes/users');
const PORT = process.env.PORT || 3000 ;
const connectDB = require('./server/config/db');
const cookieParser = require('cookie-parser');



app.use(cookieParser());
app.use(express.json());

connectDB();

app.use("/api" , user);

app.listen(PORT , () => {
    console.log(`app is listening at ${PORT}`);
})
