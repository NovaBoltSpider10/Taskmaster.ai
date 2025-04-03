import mongoose from 'mongoose'

const preferencesSchema = new mongoose.Schema({
    personality: { type: Number, required: true, unique: true },
    time: { type: Number, required: true, unique: true },
    inPerson: { type: Bool, required: true, unique: true },
    privateSpace: { type: Bool, required: true, unique: true },
});

export default preferencesSchema;