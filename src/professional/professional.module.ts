import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";

import { ProfessionalController } from './professional.controller';
import { ProfessionalService } from './professional.service';
import { professionalSchema } from './professional.model';
import { JwtModule } from '@nestjs/jwt';
import { ForgetpasswordService } from 'src/mail/forgetpassword/forgetpassword.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name : 'Professional', schema: professionalSchema}
    ]),
    JwtModule.register({
      secret: process.env.secret,
      signOptions: { expiresIn: '30d' },
    })
  ],
  controllers: [ProfessionalController],
  providers: [ProfessionalService, ForgetpasswordService]
})
export class ProfessionalModule {}
