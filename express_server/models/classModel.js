import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
    name: String,
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
