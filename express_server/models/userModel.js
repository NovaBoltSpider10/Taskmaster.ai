import mongoose from 'mongoose';
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
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

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({_id: this._id}, "secretstring1234");
  }

export default mongoose.model('User', userSchema);
