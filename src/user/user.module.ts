import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { userSchema } from './user.model';
import { JwtModule } from '@nestjs/jwt';
import { ForgetpasswordService } from 'src/mail/forgetpassword/forgetpassword.service';
import { professionalSchema } from 'src/professional/professional.model';
import { ChatService } from 'src/socket/socket.service';
import { ChatModule } from 'src/socket/socket.module';
import { VerificationService } from 'src/mail/verification/verification.service';
import { MulterModule } from '@nestjs/platform-express';
import { TaskService } from 'src/task/task.service';
import { taskSchema } from 'src/task/schema/task.model';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ConfigService } from '@nestjs/config';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { reviewSchema } from 'src/review/schema/review.model';

@Module({
  imports : [
    MongooseModule.forFeature([
      {name: 'User', schema: userSchema},
      {name: 'Professional', schema: professionalSchema},
      {name: 'Task', schema: taskSchema},
      {name: 'Review', schema: reviewSchema}
    ]),
    JwtModule.register({
      secret: process.env.secret,
      signOptions: { expiresIn: '30d' },
    }),
    ChatModule,
    CloudinaryModule,
    ScheduleModule
  ],
  controllers: [UserController],
  providers: [UserService, ForgetpasswordService, ChatService, VerificationService, TaskService, CloudinaryService, ConfigService],
  exports : [UserService]
})
export class UserModule {}
