const express = require("express");
const mongoose = require("mongoose");
const { auth, requiresAuth } = require('express-openid-connect');
const config = require('./controllers/authController.js');
const User = require("./models/userModel.js");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const app = express();
 
mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("MongoDB connection error: ", err));

app.use(auth(config));

app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/callback', requiresAuth(), (req, res) => {
    // let username = JSON.stringify(req.oidc.user.nickname, null, 2);
    // let firstName = JSON.stringify(req.oidc.user.given_name , null, 2);
    // let lastName = JSON.stringify(req.oidc.user.family_name, null, 2);
    // let email = JSON.stringify(req.oidc.user.email, null, 2);
    // const newUser = new User({username: username, fistName: firstName, lastName: lastName, email: email});
});

app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user, null, 2));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));