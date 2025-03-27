import mongoose from 'mongoose';

const resourceSchema = mongoose.Schema({
    urls: [String],
    websites: [String],
    class: { type: Schema.Types.ObjectId, ref: 'Class' }
});

export default mongoose.model('Calendar', resourceSchema);