const mongoose = require('mongoose');

const resourceSchema = mongoose.Schema({
    urls: [String],
    websites: [String],
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' }
});

module.exports = mongoose.model('Resource', resourceSchema);