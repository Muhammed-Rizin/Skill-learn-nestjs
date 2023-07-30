import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
@Module({
    imports: [
        JwtModule.register({
          secret: process.env.secret,
          signOptions: { expiresIn: '3d' },
        })
      ],
      controllers: [],
      providers: [AuthService]
})
export class AuthModule {}
