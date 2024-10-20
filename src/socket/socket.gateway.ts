import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageDto } from './dto/chat.dto';
import { ChatService } from './socket.service';

import * as dotenv from 'dotenv';
dotenv.config();

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

@WebSocketGateway({ cors: { origin: allowedOrigins, credentials: true } })
export class ChatGateway implements OnGatewayConnection {
  constructor(private chatService: ChatService) {}

  @WebSocketServer() server: Server;

  handleConnection(socket: Socket) {
    const userId: string = socket.handshake.auth.userId;
    console.log(userId);
  }

  @SubscribeMessage('join')
  handleJoinEvent(socket: Socket, roomName: string) {
    socket.join(roomName);
    socket.broadcast.to(roomName).emit('member-joined');
  }
  @SubscribeMessage('message')
  async handleMessage(socket: Socket, message: MessageDto) {
    try {
      await this.chatService.saveMessage(message);
      const messageData = await this.chatService.findMessageByRoomId(
        message.roomName,
      );

      this.server.to(message.roomName).emit('message', {
        sender: message.from,
        text: message.message,
        receiver: message.to,
        data: messageData,
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  @SubscribeMessage('new-call')
  async newCall(
    socket: Socket,
    { room, to, from }: { room: string; to: string; from: string },
  ) {
    await this.chatService.addCall(room, to, from);
  }

  @SubscribeMessage('disconnect-user')
  async handleDisconnectUser(socket: Socket, roomId: string) {
    this.server.to(roomId).emit('user-disconnected', roomId);
    socket.leave(roomId);
  }

  @SubscribeMessage('send-message')
  async handleVideoMessages(
    socket: Socket,
    { message, roomId }: { message: any; roomId: any },
  ) {
    socket.broadcast.to(roomId).emit('receive-message', message);
  }
}
