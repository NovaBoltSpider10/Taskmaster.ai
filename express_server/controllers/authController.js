import User from "../models/userModel.js";
import bcrypt from "bcrypt";

// Login
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", { email, password });

    const user = await User.findOne({ email });
    if (!user) {
      console.log("No user found with email:", email);
      return res.status(400).json({ message: "Invalid email" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    console.log("Password valid:", validPassword);

    if (!validPassword) {
      console.log("Password mismatch for user:", email);
      return res.status(400).json({ message: "Invalid password" });
    }

    console.log("Password match, generating token...");

    const token = user.generateAuthToken();
    console.log("Token generated:", token);

    res.send(token);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { authUser, resetPassword };
