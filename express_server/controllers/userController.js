import User from '../models/userModel.js';
import bcrypt from 'bcrypt';

//Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//Get profile
const getUserbyEmail = async (req, res) => {
    try {
        const user = await User.findOne({email: req.params.email});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserbyId = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.userid});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createUser = async (req, res) => {
    try {
        const { userName, firstName, lastName, password, email } = req.body;
    
        const checkUserEmail = await User.findOne({email});
        const checkUserName = await User.findOne({userName});
    
        if(checkUserEmail || checkUserName){
          return res.status(400).json({message: "Username or email already taken"});
        }
    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ userName, firstName, lastName, password: hashedPassword, email });
        const savedUser = await newUser.save();
    
        const token = savedUser.generateAuthToken();
        return res.header("x-auth-token", token).status(201).send( token );
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
};

//Used by /me
const getUserByToken = async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
  }


//Update user
const updateProfile = async (req, res) => {
    try {
        const { username, firstName, lastName, email, pfp, friendsList} = req.body;
        const update = {
            username: username,
            firstName: firstName,
            lastName: lastName,
            email: email,
            pfp: pfp,
            friendsList: friendsList
        };
        const updatedProfile = await User.findOneAndUpdate({_id: req.params.userid}, update,{ new: true });

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
    getUserbyEmail,
    updateProfile,
    deleteUser,
    createUser,
    getUserByToken,
    getUserbyId
}