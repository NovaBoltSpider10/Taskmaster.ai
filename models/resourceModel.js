const mongoose = require('mongoose');

const calendarSchema = mongoose.Schema({
    urls: [String],
    websites: [String],
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' }
});

module.exports = mongoose.model('Calendar', calendarSchema);