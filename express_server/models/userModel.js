const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, //Rq
    firstName: { type: String},
    lastName: String,
    password: { type: String, required: true }, //Rq
    email: { type: String, required: true, unique: true }, //Rq
    pfp: String,

    phoneNumber: String,
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    calendar: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Calendar' }],
    gpa: Number,
    friendsList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    points: Number,
    streak: Number,
    slcSessions: [String] 
});

module.exports = mongoose.model('User', userSchema);