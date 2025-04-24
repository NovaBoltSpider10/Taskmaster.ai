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
        console.log("logged out validate auth");
        return false;
    }

    return true;
};

const validateUser = async (req, res) => {
    const user = await User.findOne({ sub: req.oidc.user.sub });
    if (!user) {
        console.log('not setup');
        return false;
    }

    return true;
};

export {
    config, validateAuth, validateUser,
};
