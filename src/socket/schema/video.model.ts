import * as mongoose from 'mongoose';

export const videoSchema = new mongoose.Schema({
  from: { type: String, required: true, ref: 'Professional' },
  to: { type: String, required: true, ref: 'User' },
  room: { type: String, required: true },
  status: { type: String, required: true },
});
