import User from '../models/userModel.js';
import jwt from "jsonwebtoken";
import crypto from 'crypto';

const getUserByToken = async (req, res) => {
  const user = await User.findById(req.body.userId).select('-password');
  res.send(user);
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserByUsername = async (req, res) => {
  try {
    const user = await User.find(req.body.username);
    if (!user) {
      return res.status(404).json({ message: "User was not found" });
    }
    return res.status(202).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const setupUser = async (req, res) => {
  try {
    const { username, firstName, lastName, email, dob } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already taken" });
    }

    if (await User.findOne({ userName })) {
      return res.status(400).json({ message: "Email already taken" });
    }

    const newUserId = crypto.randomBytes(8).toString("hex");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      userId: newUserId,
      username: username,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      dob: dob,
    });

    newUser.save();

    const token = jwt.sign({ id: newUserId }, "secretstring1234");

    return res.header("x-auth-token", token).status(201).send(token);
  }
  catch (err) {
    res.status(500).json({ message: error.message });
  }
};

//Delete user
const deleteUser = async (req, res) => {
  try {
    const deleteUser = await User.findOneAndDelete({ userId: req.body.userId });
    if (!deleteUser) {
      return res.status(404).json({ message: "User mot found" });
    }

    res.status(200).json(deleteUser);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export {
  getUserByToken,
  getAllUsers,
  getUserByUsername,
  setupUser,
  updateProfile,
  deleteUser,
}