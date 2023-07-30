import * as mongoose from 'mongoose';

export type MessageType = 'User' | 'Professional';

export const MessageSchema = new mongoose.Schema({
  messages: [
    {
      text: { type: String, required: true },
      sender: { type: mongoose.Schema.Types.ObjectId, refPath: 'messages.senderType', required: true },
      recever: { type: mongoose.Schema.Types.ObjectId, refPath: 'messages.receverType', required: true },
      time: { type: Date, required: true },
      senderType: { type: String, enum: ['User', 'Professional'], required: true },
      receverType: { type: String, enum: ['User', 'Professional'], required: true },
    },
  ],
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  roomId: { type: String, required: true },
});


export interface Message extends Document {
  messages: Array<{
    text: string;
    sender: mongoose.Schema.Types.ObjectId;
    recever: mongoose.Schema.Types.ObjectId;
    time: Date;
    senderType: 'User' | 'Professional';
    receverType: 'User' | 'Professional';
  }>;
  users: mongoose.Schema.Types.ObjectId[];
  roomId: string;
}