import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { adminSchema } from './admin.model';
import { professionalSchema } from 'src/professional/professional.model';
import { userSchema } from 'src/user/user.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports : [
    MongooseModule.forFeature([
      {name: 'Admin', schema: adminSchema},
      {name: 'Professional', schema: professionalSchema},
      {name: 'User', schema: userSchema}
    ]),
    JwtModule.register({
      secret: process.env.secret,
      signOptions: { expiresIn: '30d' },
    })
  ],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
