import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { userSchema } from './user.model';
import { JwtModule } from '@nestjs/jwt';
import { ForgetpasswordService } from 'src/mail/forgetpassword/forgetpassword.service';
import { professionalSchema } from 'src/professional/professional.model';
import { ChatService } from 'src/chat/chat.service';
import { ChatModule } from 'src/chat/chat.module';
import { VerificationService } from 'src/mail/verification/verification.service';

@Module({
  imports : [
    MongooseModule.forFeature([
      {name: 'User', schema: userSchema},
      {name: 'Professional', schema: professionalSchema}
    ]),
    JwtModule.register({
      secret: process.env.secret,
      signOptions: { expiresIn: '30d' },
    }),
    ChatModule
  ],
  controllers: [UserController],
  providers: [UserService, ForgetpasswordService, ChatService, VerificationService]
})
export class UserModule {}
