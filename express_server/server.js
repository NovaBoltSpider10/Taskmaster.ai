const express = require("express");
const mongoose = require("mongoose");
const { auth, requiresAuth } = require('express-openid-connect');
var bodyParser = require('body-parser');

const authController = require('./controllers/authController.js');
const userController = require('./controllers/userController.js');
const User = require("./models/userModel.js");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
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
    if (!authController.validateAuth(req, res)) {
        return;
    }
});

app.get('/setup', requiresAuth(), (req, res) => {
    res.sendFile('public/setup.html', { root: __dirname });
});

app.post('/setup', requiresAuth(), async (req, res) => {
    if (!userController.setupUser(req, res)) {
        return;
    }
});

app.get('/profile', requiresAuth(), async (req, res) => {
    const existingUser = await User.findOne({ sub: req.oidc.user.sub });
    res.send(JSON.stringify(existingUser));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
