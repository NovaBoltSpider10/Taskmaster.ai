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
        res.status(401).send(json({message: 'logged out'}));
        return false;
    }

    const existingUser = await User.findOne({ sub: req.oidc.user.sub });

    if (!existingUser) {
        res.status(401).json({message: 'databse not configured. call /setup endpoint'});
        return false;
    }

    res.status(200);
};

export default {config, validateAuth};
