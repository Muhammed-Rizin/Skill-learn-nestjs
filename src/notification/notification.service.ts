import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { NotificationType } from './dto/notification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification')
    private readonly notificationModel: Model<NotificationType>,
  ) {}
  async newNotification(data: NotificationType, res: Response) {
    try {
      const newNotification = new this.notificationModel(data);
      await newNotification.save();

      return res.status(200).json({ message: 'success' });
    } catch (error) {
      return res.status(500).json({ message: 'internal server error' });
    }
  }

  async updateStatus(userId: string, roomId: string, res: Response) {
    try {
      await this.notificationModel.updateMany(
        { to: userId, roomId: roomId },
        { $set: { read: true } },
      );
      return res.status(200).json({ message: 'success' });
    } catch (error) {
      return res.status(500).json({ message: 'internal server error' });
    }
  }

  async getNotification(userId: string, res: Response) {
    try {
      const notifications = await this.notificationModel
        .find({ to: userId, read: false })
        .sort({ _id: -1 });
      res.status(200).json({ notifications });
    } catch (error) {
      return res.status(500).json({ message: 'internal server error' });
    }
  }
}
