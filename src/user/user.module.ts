import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { userSchema } from './user.model';
import { JwtModule } from '@nestjs/jwt';
import { ForgetpasswordService } from 'src/mail/forgetpassword/forgetpassword.service';

@Module({
  imports : [
    MongooseModule.forFeature([{
      name: 'User', schema: userSchema
    }]),
    JwtModule.register({
      secret: process.env.secret,
      signOptions: { expiresIn: '30d' },
    })
  ],
  controllers: [UserController],
  providers: [UserService, ForgetpasswordService]
})
export class UserModule {}
