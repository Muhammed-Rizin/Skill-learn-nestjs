import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { notificationSchema } from './schema/notification.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Notification', schema: notificationSchema },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
