import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: 'http://localhost:5000',
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`
};

const validateAuth = async (req, res) => {
    if (!req.oidc.isAuthenticated()) {
        res.send('Logged out <br> <a href="/login">Login</a>');
        return false;
    }

    const existingUser = await User.findOne({ sub: req.oidc.user.sub });

    if (!existingUser) {
        res.redirect('/setup');
        return false;
    }

    res.send(
        `Logged in <br> 
            <a href="/logout">Logout</a> <br> 
            <a href="/profile">profile</a> <br>
            `
    );
};

export default {
    config, validateAuth
}