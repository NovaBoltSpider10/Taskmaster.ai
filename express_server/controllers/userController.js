import User from '../models/userModel.js';
import { validateAuth } from './authController.js';

//Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserID = async(req, res) => {
    console.log(req.session.sub);
    if (req.session.sub) {
        res.status(200).json({id: req.session.sub});
        return;
    }
    
    res.status(404).json({id: "ID not found"});
};

//Get profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findOne({ sub: req.oidc.user.sub });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const setupUser = async (req, res) => {
    const existingUser = await User.findOne({ sub: req.oidc.user.sub });
    
    if (existingUser) {
        res.redirect('/');
        return;
    }

    // Needs username, first name, last name from frontend
    const newUser = new User({
        sub: req.oidc.user.sub,
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.oidc.user.email,
        pfp: req.oidc.user.picture,
    });

    newUser.save()
        .catch((err) => {
            console.log(err);
            return false;
    });

    res.redirect('/');
};


//Update user
const updateProfile = async (req, res) => {
    try {
        const { username, firstName, lastName, email, pfp, } = req.body;
        const query = { sub: req.oidc.user.sub };
        const update = {
            username: username,
            firstName: firstName,
            lastName: lastName,
            email: emaill,
            pfp: pfp,
        };
        const updatedProfile = await User.findOneAndUpdate(query, update, { new: true });

        if (!updatedProfile) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Delete user
const deleteUser = async (req, res) => {
    try {
        const deleteUser = await User.findOneAndDelete({ sub: req.oidc.user.sub });
        if (!deleteUser) {
            return res.status(404).json({ message: "User mot found" });
        }

        res.status(200).json(deleteUser);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export {
    getAllUsers,
    getUserID,
    getProfile,
    updateProfile,
    deleteUser,
    setupUser,
}