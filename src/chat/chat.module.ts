import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from './schema/chat.model';

@Module({
    imports : [MongooseModule.forFeature([{name : 'Message', schema : MessageSchema}])],
    providers : [ChatService],
    exports : [MongooseModule]
})
export class ChatModule {}
