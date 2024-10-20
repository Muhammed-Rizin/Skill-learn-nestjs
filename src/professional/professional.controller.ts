import {
  Controller,
  Post,
  Body,
  Res,
  Query,
  Get,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Response } from 'express';

import { ProfessionalService } from './professional.service';
import { Professional } from './dto/professional.dto';
import { ChatService } from 'src/socket/socket.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { TaskService } from 'src/task/task.service';
import { PaymentService } from 'src/payment/payment.service';
import { Task } from 'src/task/dto/task.dto';
import { ScheduleService } from 'src/schedule/schedule.service';
import { Schedule } from 'src/schedule/dto/schedule.dto';
import { UserService } from 'src/user/user.service';

@Controller('professional')
export class ProfessionalController {
  constructor(
    private readonly professionalService: ProfessionalService,
    private readonly chatService: ChatService,
    private readonly _paymentService: PaymentService,
    private readonly _taskService: TaskService,
    private readonly _scheduleService: ScheduleService,
    private readonly userService: UserService,
  ) {}

  // POST /professional/login
  @Post('login')
  async professionalLogin(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    try {
      return this.professionalService.professionalLogin(email, password, res);
    } catch (error) {
      if (error.message === 'User not Found') {
        return res.status(404).json({ message: 'User not Found' });
      } else if (error.message === 'Password is incorrect') {
        return res.status(400).json({ message: 'Password is incorrect' });
      } else {
        return res.status(400).json({ message: 'This email id is blocked' });
      }
    }
  }

  // POST /professional/register
  @Post('register')
  async professionalRegister(
    @Body()
    userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      education: string;
    },
    @Res() res: Response,
  ) {
    try {
      return this.professionalService.professionalRegister(userData, res);
    } catch (error) {
      if (error.message === 'Email already registered') {
        return res.status(400).json({ message: 'Email already registered' });
      }
    }
  }

  // GET /user/checkemail
  @Get('checkemail')
  async checkEmail(@Query('email') email: string, @Res() res: Response) {
    try {
      return await this.professionalService.checkEmail(email, res);
    } catch (error) {
      return res.status(200).json({ message: 'Email already registered' });
    }
  }

  // GET /professional/userData
  @Get('userData')
  async userData(@Query('id') id: string, @Res() res: Response) {
    try {
      return await this.userService.userData(id, res);
    } catch (error) {
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }

  // GET  /professional/forgetpassword
  @Get('forgetpassword')
  async professionalForgetPassword(
    @Query('email') email: string,
    @Res() res: Response,
  ) {
    return this.professionalService.professionalForgetPassword(email, res);
  }

  // GET /professional/forgetpassword/professional_details
  @Get('forgetpassword/professional_details')
  async professionalDetails(
    @Query('token') token: string,
    @Res() res: Response,
  ) {
    return this.professionalService.professionalDetails(token, res);
  }

  // POST /professional/newpassword
  @Post('newpassword')
  async professionalNewPassword(
    @Body('password') password: string,
    @Body('token') token: string,
    @Res() res: Response,
  ) {
    return this.professionalService.newPassword(password, token, res);
  }

  // GET /professional/isblocked
  @Get('isblocked')
  async isblocked(@Body('userId') id: string, @Res() res: Response) {
    return await this.professionalService.isBlocked(id, res);
  }

  // GET /professional/isapproved
  @Get('isapproved')
  async isapproved(@Body('userId') id: string, @Res() res: Response) {
    return await this.professionalService.isApproved(id, res);
  }

  // GET /professional/professionaldata
  @Get('professionaldata')
  async getProfessionalData(@Body('userId') id: string, @Res() res: Response) {
    try {
      return await this.professionalService.getProfessionalData(id, res);
    } catch (error) {
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }
  // PATCH /professional/updateprofessional
  @Patch('updateprofessional')
  async updateProfessionalData(
    @Body('data') data: Professional,
    @Res() res: Response,
  ) {
    try {
      return await this.professionalService.updateProfessionalData(data, res);
    } catch (error) {
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }

  // GET /professional/getchats
  @Get('getchats')
  async getchats(@Body('userId') userId: string, @Res() res: Response) {
    try {
      return await this.chatService.getChats(userId, res);
    } catch (error) {
      res.status(500).json({ message: 'internal server error' });
    }
  }
  // GET /professional/getchathistory
  @Get('getchathistory')
  async getChathistory(
    @Query('roomid') roomId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Res() res: Response,
  ) {
    try {
      return await this.chatService.getChatHistory(roomId, page, limit, res);
    } catch (error) {
      res.status(500).json({ message: 'internal server error' });
    }
  }

  // GET /professional/sendverifymail
  @Get('sendverifymail')
  async sendVerifyEmail(@Body('userId') userId: string, @Res() res: Response) {
    try {
      return await this.professionalService.sendVerifyEmail(userId, res);
    } catch (error) {
      res.status(500).json({ message: 'internal server error' });
    }
  }

  // GET /professional/verifyemail
  @Get('verifyemail')
  async verifyEmail(
    @Query('token') token: string,
    @Body('userId') id: string,
    @Res() res: Response,
  ) {
    try {
      return this.professionalService.verifyEmail(id, token, res);
    } catch (error) {
      res.status(500).json({ message: 'internal server error' });
    }
  }

  // POST /professional/uploadimage
  @Post('uploadimage')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(
    @Query('id') id: string,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      return this.professionalService.submitImage(id, file, res);
    } catch (error) {
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }

  // GET /professional/getsubscribers
  @Get('getsubscribers')
  async getSubscribers(@Body('userId') id: string, @Res() res: Response) {
    try {
      return this._paymentService.getSubscribedUsers(id, res);
    } catch (error) {
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }

  // POST /professional/addTask
  @Post('addtask')
  async addTask(
    @Body('userId') id: string,
    @Body('task') task: Task,
    @Res() res: Response,
  ) {
    try {
      return await this._taskService.addTask(task, id, res);
    } catch (error) {
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }

  // GET /professioanl/inprogresstask
  @Get('inprogresstask')
  async inprogressTask(
    @Query('page') page: number,
    @Body('userId') id: string,
    @Res() res: Response,
  ) {
    try {
      return await this._taskService.getInprogressTasks(id, page, res);
    } catch (error) {
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }

  // GET /professioanl/completedtask
  @Get('completedtask')
  async completedTask(
    @Query('page') page: number,
    @Body('userId') id: string,
    @Res() res: Response,
  ) {
    try {
      return await this._taskService.getCompletedTasks(id, page, res);
    } catch (error) {
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }

  // POST /professional/schedule
  @Post('schedule')
  async scheduleMeeting(
    @Body('userId') id: string,
    @Body('schedule') meeting: Schedule,
    @Res() res: Response,
  ) {
    try {
      return await this._scheduleService.scheduleMeeting(meeting, id, res);
    } catch (error) {
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }

  // GET /professional/inprogressmeeting
  @Get('inprogressmeeting')
  async inProgressMeeting(
    @Query('page') page: number,
    @Body('userId') id: string,
    @Res() res: Response,
  ) {
    try {
      return await this._scheduleService.getInprogress(id, page, res);
    } catch (error) {
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }

  // GET /professional/completedmeeting
  @Get('completedmeeting')
  async completedMeeting(
    @Query('page') page: number,
    @Body('userId') id: string,
    @Res() res: Response,
  ) {
    try {
      return await this._scheduleService.getCompleted(id, page, res);
    } catch (error) {
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }

  // PATCH /professional/meetingdone
  @Patch('meetingdone')
  async meetingDone(@Body('id') id: string, @Res() res: Response) {
    try {
      return await this._scheduleService.meetingDone(id, res);
    } catch (error) {
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }

  // PATCH /professional/setnotification
  @Patch('setnotification')
  async setNotification(
    @Body('token') token: string,
    @Body('userId') id: string,
    @Res() res: Response,
  ) {
    try {
      this.professionalService.setNotification(id, token, res);
    } catch (error) {
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }

  // PATCH /professional/messageseen
  @Patch('messageseen')
  async setReadStatus(@Query('roomid') roomId: string, @Res() res: Response) {
    try {
      return this.chatService.updateStatusProfessional(roomId, res);
    } catch (error) {
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }
}
