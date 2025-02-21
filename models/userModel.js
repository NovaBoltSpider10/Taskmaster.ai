const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    f_name: String,
    l_name: String,
    password: String,
    email: String,
    picture: String
});

module.exports = mongoose.model('User', userSchema);