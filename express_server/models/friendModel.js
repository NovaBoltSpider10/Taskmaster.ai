import mongoose from 'mongoose';

const friendSchema = new mongoose.Schema({
    name: String,
    commonClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    contactInfo: String,
    user: {type: String, required: true }
});

export default mongoose.model('Class', classSchema);
