import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
    
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Tasks', required: false },
    topic: String,
    question: String,
    answer: String,
});

export default mongoose.model('FlashCards', classSchema);
