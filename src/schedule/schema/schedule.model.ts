import * as mongoose from 'mongoose';

export const scheduleSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.ObjectId, required: true, ref: 'Professional' },
  to: { type: mongoose.Schema.ObjectId, required: true, ref: 'User' },
  time: { type: Date, required: true },
  topic: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
});
