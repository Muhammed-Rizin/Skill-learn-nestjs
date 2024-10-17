import * as mongoose from 'mongoose';

export const reviewSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true },
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    professional: { type: mongoose.Schema.ObjectId, ref: 'Professional' },
  },
  { timestamps: true },
);
