import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { MulterModule } from '@nestjs/platform-express';

import { ProfessionalController } from './professional.controller';
import { ProfessionalService } from './professional.service';
import { professionalSchema } from './schema/professional.model';
import { JwtModule } from '@nestjs/jwt';
import { ForgotPasswordService } from 'src/mail/forgotPassword/forgotPassword.service';
import { ChatService } from 'src/socket/socket.service';
import { userSchema } from 'src/user/schema/user.model';
import { ChatModule } from 'src/socket/socket.module';
import { VerificationService } from 'src/mail/verification/verification.service';
import { AuthService } from 'src/auth/auth.service';
import { PaymentService } from 'src/payment/payment.service';
import { paymentSchema } from 'src/payment/schema/payment.model';
import { TaskService } from 'src/task/task.service';
import { taskSchema } from 'src/task/schema/task.model';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ConfigService } from '@nestjs/config';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'User', schema: userSchema},
      {name : 'Professional', schema: professionalSchema},
      {name: 'Payment', schema: paymentSchema},
      {name: 'Task', schema: taskSchema},
    ]),
    JwtModule.register({
      secret: process.env.secret,
      signOptions: { expiresIn: '30d' },
    }),
    ChatModule,
    ScheduleModule
  ],
  controllers: [ProfessionalController],
  providers: [
    ProfessionalService, 
    ForgotPasswordService, 
    ChatService, 
    VerificationService, 
    AuthService,
    PaymentService,
    TaskService,
    CloudinaryService,
    ConfigService,
    UserService
  ]
})
export class ProfessionalModule {}
