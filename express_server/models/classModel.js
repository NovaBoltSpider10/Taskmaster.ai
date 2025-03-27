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
    resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: false }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tasks', required: false }],

});

export default mongoose.model('Class', classSchema);
