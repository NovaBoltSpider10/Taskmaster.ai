const mongoose = require('mongoose');

const calendarSchema = mongoose.Schema({
    urls: [String],
    websites: [String]
});

module.exports = mongoose.model('Calendar', calendarSchema);