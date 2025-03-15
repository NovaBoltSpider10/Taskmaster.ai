import User from '../models/userModel.js';

//Get all users
const getAllUsers = async(req, res) => {
    try {
        const users = await User.find({password});
        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//Get profile
const getProfile = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user)
        {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({message: error.message});
    }


};

//Update user
const updateProfile = async(req, res) => {
    try {
        const {username, firstName, lastName, password, email, profilePicture, } = req.body;
        const updatedTask = await User.findByIdAndUpdate(req.params.id, {username, password, email}, {new: true});

        if (!updatedProfile)
        {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(500).json({message: error.message});
    }

};

//Delete user
const deleteUser = async(req, res) => {
    try {
        const deleteUser = await User.findByIdAndDelete(req.params.id);
        if (!deleteUser)
        {
            return res.status(404).json({message: "User mot found"});
        }
        res.status(200).json(deleteUser);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export {
    getAllUsers,
    getProfile,
    updateProfile,
    deleteUser
};