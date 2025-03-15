import mongoose from 'mongoose';

const calendarSchema = new mongoose.Schema({
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    holidays: [Date],
    events: [String] // Events sourced from Outlook
});

export default mongoose.model('Calendar', calendarSchema);
