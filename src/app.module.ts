import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config()

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { ProfessionalModule } from './professional/professional.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ForgetpasswordService } from './mail/forgetpassword/forgetpassword.service';
import { VerificationService } from './mail/verification/verification.service';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { excluded } from './auth/exclude.auth';
import { ChatGateway } from './chat/chat.gateway';
import { ChatService } from './chat/chat.service';
import { ChatModule } from './chat/chat.module';
import { PaymentModule } from './payment/payment.module';
import { TaskModule } from './task/task.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ScheduleModule } from './schedule/schedule.module';

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
    }),
    AuthModule,
    ChatModule,
    PaymentModule,
    TaskModule,
    CloudinaryModule,
    ScheduleModule,
  ],
  controllers: [AppController],
  providers: [AppService, ForgetpasswordService, VerificationService, ChatGateway, ChatService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthService).exclude(...excluded).forRoutes('/*');
  }
}
