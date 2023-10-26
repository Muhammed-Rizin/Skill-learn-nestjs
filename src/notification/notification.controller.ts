import { Body, Controller, Get, Patch, Post, Res } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Response } from 'express';
import { NotificationType } from './dto/notification.dto';

@Controller('notification')
export class NotificationController {
    constructor(
        private _notificationService : NotificationService
    ){}

    // GET /notification/getNotification
    @Get('getNotification') 
    getNotification(
        @Body('userid') id : string,
        @Res() res : Response
    ) {
        try {
            return this._notificationService.getNotification(id , res)
        } catch (error) {
            return res.status(500).json({message : 'internal server error'})
        }
    }
    
    // POST /notification/newNotification
    @Post('newNotification') 
    newNotification(
        @Body('notification') data : NotificationType,
        @Res() res : Response
    ) {
        try {
            return this._notificationService.newNotification(data, res)
        } catch (error) {
            return res.status(500).json({message : 'internal server error'})
        }
    }

    // PATCH /notifiacation/updateStatus
    @Patch('updateStatus')
    updateStatus(
        @Body('userId') id : string,
        @Body('roomId') roomId : string,
        @Res() res : Response
    ) {
        try {
            return this._notificationService.updateStatus(id, roomId, res)
        } catch (error) {
            return res.status(500).json({message : 'internal server error'})
        }
    }
}
