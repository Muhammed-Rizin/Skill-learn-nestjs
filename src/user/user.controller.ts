import { Controller, Post, Body, Res} from '@nestjs/common';
import { Response } from 'express';

import { UserService } from './user.service';
import { User } from './user.model';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService : UserService
    ){}

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
}
