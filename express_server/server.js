const express = require("express");
const mongoose = require("mongoose");
const { auth, requiresAuth } = require('express-openid-connect');
var bodyParser = require('body-parser');

const authController = require('./controllers/authController.js');
const User = require("./models/userModel.js");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const app = express();

mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("MongoDB connection error: ", err));

app.use(auth(authController.config));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', async (req, res) => {
    if (!req.oidc.isAuthenticated())
    {
        res.send('Logged out <br> <a href="/login">Login</a>');
        return;
    }

    const existingUser = await User.findOne({sub: req.oidc.user.sub});  

    if (!existingUser)
    {
        res.redirect('/setup');
        return;
    }

    res.send(
        `Logged in <br> 
        <a href="/logout">Logout</a> <br> 
        <a href="/profile">profile</a> <br>
        `
    );
});

app.get('/setup', requiresAuth(), (req, res) => {
    res.sendFile('public/setup.html', {root: __dirname});
});

app.post('/setup', requiresAuth(), async (req, res) => {
    const newUser = new User({
        sub: req.oidc.user.sub,
        username: req.body.username,
        firstName: req.body.fname,
        lastName: req.body.lname,
        email: req.oidc.user.email,
        pfp: req.oidc.user.picture,
    });

    newUser.save()
        .catch((err) => {
            console.log(err);
            res.sendFile('public/setup_error.html', {root: __dirname});
            return;
        });

    res.redirect('/');
});

app.get('/profile', requiresAuth(), (req, res) => {
    res.send(req.oidc.user);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
