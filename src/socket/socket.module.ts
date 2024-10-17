import { Module } from '@nestjs/common';
import { ChatService } from './socket.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from './schema/chat.model';
import { videoSchema } from './schema/video.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Message', schema: MessageSchema },
      { name: 'Call', schema: videoSchema },
    ]),
  ],
  providers: [ChatService],
  exports: [MongooseModule],
})
export class ChatModule {}
