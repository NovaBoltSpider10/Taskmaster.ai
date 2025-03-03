const express = require("express");
const mongoose = require("mongoose");
const jwtCheck = require('./controllers/jwtCheck.js');
const User = require('./models/userModel.js');
require("dotenv").config();

const port = 3000;
const app = express();

mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("MongoDB connection error: ", err));

app.use(jwtCheck);

app.get('/authorized', function (req, res) {
    res.send('Secured Resource');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});