import * as mongoose from 'mongoose';

export const taskSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.ObjectId, required: true, ref: 'Professional' },
  to: { type: mongoose.Schema.ObjectId, required: true, ref: 'User' },
  endTime: { type: Date, required: true },
  task: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
});
