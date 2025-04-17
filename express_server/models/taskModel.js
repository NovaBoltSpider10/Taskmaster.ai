import mongoose from 'mongoose';

const taskSchema = mongoose.Schema({
    topic: String,
    title: String,
    resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
    status: { type: String, enum: ['pending', 'completed', 'overdue'], default: 'pending' },
    points: Number,

    taskType: String,
    deadline: Date,
    earnedPoints: Number,
    completed: Boolean,

    textbook: String,
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class'}
});

// TODO: add api endpoint for getting all incomplete tasks, complete tasks

export default mongoose.model('Task', taskSchema);