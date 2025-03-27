import User, { find, findOne, findOneAndUpdate, findOneAndDelete } from '../models/userModel';

//Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await find({});
        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//Get profile
const getProfile = async (req, res) => {
    try {
        const user = await findOne({ sub: req.oidc.user.sub });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const setupUser = async (req, res) => {
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
        const updatedProfile = await findOneAndUpdate(query, update, { new: true });

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
        const deleteUser = await findOneAndDelete({ sub: req.oidc.user.sub });
        if (!deleteUser) {
            return res.status(404).json({ message: "User mot found" });
        }

        res.status(200).json(deleteUser);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default {
    getAllUsers,
    getProfile,
    updateProfile,
    deleteUser,
    setupUser
}
