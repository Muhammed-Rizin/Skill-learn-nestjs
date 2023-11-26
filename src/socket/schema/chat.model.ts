import * as mongoose from 'mongoose';

export type MessageType = 'User' | 'Professional';

export const MessageSchema = new mongoose.Schema({
  messages: [
    {
      text: { type: String, required: true },
      sender: { type: mongoose.Schema.Types.ObjectId, refPath: 'messages.senderType', required: true },
      receiver: { type: mongoose.Schema.Types.ObjectId, refPath: 'messages.receiverType', required: true },
      time: { type: Date, required: true },
      senderType: { type: String, enum: ['User', 'Professional'], required: true },
      receiverType: { type: String, enum: ['User', 'Professional'], required: true },
    },
  ],
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  roomId: { type: String, required: true },
  userRead : {type : Boolean, default: false},
  professionalRead : {type : Boolean, default: false}
});


export interface Message extends Document {
  messages: Array<{
    text: string;
    sender: mongoose.Schema.Types.ObjectId;
    receiver: mongoose.Schema.Types.ObjectId;
    time: Date;
    senderType: 'User' | 'Professional';
    receiverType: 'User' | 'Professional';
  }>;
  users: mongoose.Schema.Types.ObjectId[];
  roomId: string;
  userRead: boolean
  professionalRead: boolean
}