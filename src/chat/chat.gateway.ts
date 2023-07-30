import { Body, OnModuleInit } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { MessageDto } from './dto/chat.dto';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: 'http://localhost:3000', credentials: true } })
export class ChatGateway implements OnGatewayConnection {

  constructor(private chatService : ChatService) {}

  @WebSocketServer() server: Server

  handleConnection(socket: Socket) {
    const userId: string = socket.handshake.auth.userId;
    console.log('a user connected')
  }

  @SubscribeMessage('join')
  handleJoinEvent(socket: Socket, roomName: string) {
    socket.join(roomName)
    console.log('joined:', roomName)
  }
  @SubscribeMessage('message')
  async handleMessage(socket  : Socket, message : MessageDto) {
    try {
      const newMessage = await this.chatService.saveMessage(message);
      const messageData = await this.chatService.findMessageByRoomId(message.roomName);
      
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
}
