import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';

import { ProfessionalService } from './professional.service';

@Controller('professional')
export class ProfessionalController {
    constructor(private readonly professionalService : ProfessionalService){}

    @Post('login') 
    async professionalLogin(
        @Body('email') email : string,
        @Body('password') password : string,
        @Res() res : Response
    ){
        try {
            return this.professionalService.professionalLogin(email, password, res)
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
    async professionalRegister(
        @Body() userData : {email: string, password: string, firstName: string, lastName: string, education: string},
        @Res() res : Response
    ){
        try {
            return this.professionalService.professionalRegister(userData, res)
        } catch (error) {
            if(error.message === 'Email already registered'){
                return res.status(400).json({message : 'Email already registered'})
            }
        }
    }
}
