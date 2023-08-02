import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { MulterModule } from '@nestjs/platform-express';

import { ProfessionalController } from './professional.controller';
import { ProfessionalService } from './professional.service';
import { professionalSchema } from './professional.model';
import { JwtModule } from '@nestjs/jwt';
import { ForgetpasswordService } from 'src/mail/forgetpassword/forgetpassword.service';
import { ChatService } from 'src/chat/chat.service';
import { userSchema } from 'src/user/user.model';
import { ChatModule } from 'src/chat/chat.module';
import { VerificationService } from 'src/mail/verification/verification.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'User', schema: userSchema},
      {name : 'Professional', schema: professionalSchema}
    ]),
    JwtModule.register({
      secret: process.env.secret,
      signOptions: { expiresIn: '30d' },
    }),
    MulterModule.register({
      dest: '../public',
    }),
    ChatModule
  ],
  controllers: [ProfessionalController],
  providers: [ProfessionalService, ForgetpasswordService, ChatService, VerificationService, AuthService]
})
export class ProfessionalModule {}
