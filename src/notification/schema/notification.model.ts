import * as mongoose from 'mongoose';

export const notificationSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    roomId: { type: String },
    icon: { type: String },
    body: { type: String, required: true },
    title: { type: String, required: true },
    read: { type: Boolean, required: true, default: false },
  },
  { capped: { size: 100000, max: 1000 } },
);
