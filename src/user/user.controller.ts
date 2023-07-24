import { Controller, Post, Body, Res, Get, Query} from '@nestjs/common';
import { Response } from 'express';

import { UserService } from './user.service';
import { User } from './user.model';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService : UserService
    ){}

    // POST /user/login
    @Post('login')
    async userLogin(
        @Body('email') email : string,
        @Body('password') password : string,
        @Res() res : Response
    ){
        try {
            return this.userService.userLogin(email, password, res)
        } catch (error) {
            if(error.message === "User not Found"){
                return res.status(404).json({message : 'User not Found'})
            }else if(error.message === 'Password is incorrect'){
                return res.status(400).json({ message: 'Password is incorrect' });
            }else {
                return res.status(400).json({ message: 'This email id is blocked' });
            }
        }
    }

    // POST /user/register
    @Post('register')
    async userRegister(
        @Body() userData : {email: string, password: string, firstName: string, lastName: string, education: string},
        @Res() res : Response
    ){
        try {
            return this.userService.userRegister(userData, res)
        } catch (error) {
            if(error.message === 'Email already registered'){
                return res.status(400).json({message : 'Email already registered'})
            }
        }
    }


    // GET  /user/forgetpassword
    @Get('forgetpassword')
    async userForgetPassword(@Query('email') email : string, @Res() res: Response){
        return this.userService.userforgetPassword(email, res)
    }

    // GET /user/forgetpassword/user_details
    @Get('forgetpassword/user_details')
    async userDetails(@Query('token') token : string, @Res() res : Response){
        return this.userService.userDetails(token, res)
    }

    // POST /user/newpassword
    @Post('newpassword')
    async userNewPassword(@Body('password') password : string, @Body('token') token : string, @Res() res : Response){
        console.log(password, token)
        return this.userService.newPassword(password, token, res)
    }
}
