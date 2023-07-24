import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { ProfessionalModule } from './professional/professional.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ForgetpasswordService } from './mail/forgetpassword/forgetpassword.service';
import { VerificationService } from './mail/verification/verification.service';
import * as dotenv from 'dotenv';
dotenv.config()

@Module({
  imports: [
    UserModule, 
    AdminModule, 
    ProfessionalModule, 
    MongooseModule.forRoot(process.env.mongoDb),
    JwtModule.register({
      global : true,
      secret: process.env.secret,
      signOptions: { expiresIn: '3d' },
      secretOrPrivateKey : process.env.secret
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ForgetpasswordService, VerificationService],
})
export class AppModule {}
