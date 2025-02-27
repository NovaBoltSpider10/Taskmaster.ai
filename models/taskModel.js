const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    deadline: Date,
    topic: String,
    title: String,
    resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
    status: { type: String, enum: ['pending', 'completed', 'overdue'], default: 'pending' },
    points: Number,
    textbook: String,
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class'}
});

module.exports = mongoose.model('Task', taskSchema);