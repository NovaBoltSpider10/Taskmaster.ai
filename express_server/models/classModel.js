import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
    professor: String,
    timing: String,
    examDates: [Date],
    topics: [String],
    gradingPolicy: String,
    contactInfo: String,
    textbooks: [String],
    location: String,
    user: {type: String, required: true }

});

export default mongoose.model('Class', classSchema);
