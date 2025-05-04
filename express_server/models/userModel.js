import mongoose from 'mongoose';
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pfp: String,

    streak: Number,
    lastTaskDate: Date,
    points: Number,
    streak: Number,
    level: Number,
    groupNumber: Number,

    preferences: {
        personality: Number,
        time: Number,
        inPerson: Number,
        privateSpace: Number,
    },

    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    calendar: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Calendar' }],
    gpa: Number,
    friendsList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    slcSessions: [String]
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id }, "secretstring1234");
}

export default mongoose.model('User', userSchema);