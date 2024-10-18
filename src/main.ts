import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as dotenv from 'dotenv';
import * as morgan from 'morgan';
dotenv.config();

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev'));

  const corsOptions: CorsOptions = {
    origin: allowedOrigins,
    credentials: true,
  };
  app.enableCors(corsOptions);
  await app.listen(5000);
}
bootstrap();
