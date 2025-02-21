const express = require("express");
const mongoose = require("mongoose");
const { auth } = require('express-openid-connect');

const port = 3000;
const app = express();

mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("MongoDB connection error: ", err));

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: `http://localhost:${port}`,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_URL
};


app.use(auth(config));

app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});