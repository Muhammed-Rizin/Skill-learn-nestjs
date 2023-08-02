import { Controller, Post, Body, Res, Get, Query, Patch, UseInterceptors, UploadedFile } from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';

import { UserService } from './user.service';
import { User } from './user.model';
import { ChatService } from 'src/chat/chat.service';
import { diskStorage } from 'multer';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly chatService: ChatService
    ) { }

    // POST /user/login
    @Post('login')
    async userLogin(
        @Body('email') email: string,
        @Body('password') password: string,
        @Res() res: Response
    ) {
        try {
            return this.userService.userLogin(email, password, res)
        } catch (error) {
            if (error.message === "User not Found") {
                return res.status(404).json({ message: 'User not Found' })
            } else if (error.message === 'Password is incorrect') {
                return res.status(400).json({ message: 'Password is incorrect' });
            } else {
                return res.status(400).json({ message: 'This email id is blocked' });
            }
        }
    }

    // POST /user/register
    @Post('register')
    async userRegister(
        @Body() userData: { email: string, password: string, firstName: string, lastName: string, education: string },
        @Res() res: Response
    ) {
        try {
            return this.userService.userRegister(userData, res)
        } catch (error) {
            if (error.message === 'Email already registered') {
                return res.status(400).json({ message: 'Email already registered' })
            }
        }
    }


    // GET  /user/forgetpassword
    @Get('forgetpa/user/forgetpassword/user_detailsssword')
    async userForgetPassword(@Query('email') email: string, @Res() res: Response) {
        try {
            return this.userService.userforgetPassword(email, res)
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'internal server error' })
        }
    }

    // GET /user/forgetpassword/user_details
    @Get('forgetpassword/user_details')
    async userDetails(@Query('token') token: string, @Res() res: Response) {
        try {
            return this.userService.userDetails(token, res)
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'internal server error' })
        }
    }

    // POST /user/newpassword
    @Post('newpassword')
    async userNewPassword(@Body('password') password: string, @Body('token') token: string, @Res() res: Response) {
        try {
            return this.userService.newPassword(password, token, res)
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'internal server error' })
        }
    }

    // GET /user/isblocked
    @Get('isblocked')
    async isblocked(@Body('userid') id: string, @Res() res: Response) {
        try {
            return await this.userService.isBlocked(id, res)
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'internal server error' })
        }
    }

    // GET /user/userdata
    @Get('userdata')
    async userData(@Body('userid') id: string, @Res() res: Response) {
        try {
            return await this.userService.userData(id, res)
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'internal server error' })
        }
    }

    // GET /user/userdatabyemail
    @Get('userdatabyemail')
    async userDataByEmail(@Query('email') email: string, @Res() res: Response) {
        try {
            return await this.userService.userDataByEmail(email, res)
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'internal server error' })
        }
    }
    // GET /user/getchats
    @Get('getchats')
    async getchats(@Body('userid') userid: string, @Res() res: Response) {
        try {
            return await this.chatService.getChats(userid, res)
        } catch (error) {
            res.status(500).json({ message: 'internal server error' })
        }
    }
    // GET /user/getchathistory
    @Get('getchathistory')
    async getChathistory(@Query('roomid') roomid: string, @Res() res: Response) {
        try {
            return await this.chatService.getChatHistory(roomid, res)
        } catch (error) {
            res.status(500).json({ message: 'internal server error' })
        }
    }

    // PATCH /user/updateuser
    @Patch('updateuser')
    async updateUser(
        @Body('userid') userid: string,
        @Body('data') userData: User,
        @Res() res: Response
    ) {
        try {
            return await this.userService.updateUser(userid, userData, res)
        } catch (error) {
            res.status(500).json({ message: 'internal server error' })
        }
    }

    @Get('sendverifymail')
    async sendVerifyEmail(@Body('userid') userid: string, @Res() res: Response) {
        try {
            return await this.userService.sendVerifyEmail(userid, res)
        } catch (error) {
            res.status(500).json({ message: 'internal server error' })
        }
    }

    // GET /user/verifyemail
    @Get('verifyemail')
    async verifyEmail(
        @Query('token') token: string,
        @Body('userid') id: string,
        @Res() res: Response
    ) {
        try {
            return this.userService.verifyEmail(id, token, res)
        } catch (error) {
            res.status(500).json({ message: 'internal server error' })
        }
    }

    @Get('professionalsdata')
    async getProfessionals(@Res() res : Response){
        try {
            return this.userService.getProfessionals(res)
        } catch (error) {
            res.status(500).json({status: 'error', message: 'internal server error'})
        }
    }

    @Post('uploadimage')
    @UseInterceptors(
        FileInterceptor('profile', {
            storage : diskStorage({ 
                destination : './profile-images',
                filename : (req, file, cb) => {
                    const name = file.originalname.split(".")[0]
                    const fileExtantion = file.originalname.split(".")[1]
                    const newName = name.split(" ").join("_") + "_" + Date.now() + "." + fileExtantion
                    cb(null, newName)
                }
            }),
            fileFilter : (req, file, cb) => {
                if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
                    return cb(null, false)
                }
                cb(null, true)
            }
        })
    )
    async uploadFile(
        @Query('id') id : string, 
        @Res() res : Response,
        @UploadedFile() file : Express.Multer.File
    ) {
        try {
            return this.userService.submitImage(id, file.filename, res)
        } catch (error) {
            res.status(500).json({status: 'error', message: 'internal server error'})
        }
    }
    
    @Get('file')
    async getFile(@Query('name') name : string,@Res() res : Response) {
        try {
            console.log(name)
            return this.userService.sendFile(name, res)
        } catch (error) {
            res.status(500).json({status: 'error', message: 'internal server error'})
        }
    }
}
