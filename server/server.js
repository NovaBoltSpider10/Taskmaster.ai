const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose
    .connect("mongodb+srv://drive2winjoy:akhrub11@taskmasterai.vnuzv.mongodb.net/?retryWrites=true&w=majority&appName=Taskmasterai",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("MongoDB connection error: ", err));


