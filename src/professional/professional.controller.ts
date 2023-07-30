import { Controller, Post, Body, Res, Query, Get } from '@nestjs/common';
import { Response } from 'express';

import { ProfessionalService } from './professional.service';

@Controller('professional')
export class ProfessionalController {
    constructor(private readonly professionalService : ProfessionalService){}

    // POST /professional/login
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

    // POST /professional/register 
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


    // GET  /professional/forgetpassword
    @Get('forgetpassword')
    async professionalForgetPassword(@Query('email') email : string, @Res() res: Response){
        return this.professionalService.professionalforgetPassword(email, res)
    }

    // GET /professional/forgetpassword/professional_details
    @Get('forgetpassword/professional_details')
    async professionalDetails(@Query('token') token : string, @Res() res : Response){
        return this.professionalService.professionalDetails(token, res)
    }

    // POST /professional/newpassword
    @Post('newpassword')
    async professionalNewPassword(@Body('password') password : string, @Body('token') token : string, @Res() res : Response){
        return this.professionalService.newPassword(password, token, res)
    }

    @Get('isblocked') 
    async isblocked(@Body('userid') id : string, @Res() res : Response){
        return await this.professionalService.isBlocked(id,res)
    }

    @Get('isapproved')
    async isapproved(@Body('userid') id : string, @Res() res : Response){
        return await this.professionalService.isApproved(id, res)
    }
}
