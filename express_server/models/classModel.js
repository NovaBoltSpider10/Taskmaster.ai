const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    professor: String,
    timing: String,
    dueDates: [Date],
    examDates: [Date],
    topics: [String],
    gradingPolicy: String,
    contactInfo: String,
    textbooks: [String],
    location: String,
    resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tasks' }],

});

module.exports = mongoose.model('Class', classSchema);
