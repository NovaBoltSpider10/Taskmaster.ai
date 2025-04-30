import mongoose from 'mongoose';
import preferencesSchema from './preferencesModel.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true }, // <-- FIXED to userName
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    pfp: String,

    streak: Number,
    lastTaskDate: Date,

    preferences: preferencesSchema,
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    calendar: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Calendar' }],
    gpa: Number,
    friendsList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    points: Number,
    slcSessions: [String] 
});

// Attach token generator to each User
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  return token;
};

export default mongoose.model('User', userSchema);
