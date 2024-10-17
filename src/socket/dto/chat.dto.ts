import { MessageType } from '../schema/chat.model';

export class MessageDto {
  message: string;
  from: string;
  to: string;
  time: Date;
  type: MessageType;
  receiverType: MessageType;
  roomName: string;
}
