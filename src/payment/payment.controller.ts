import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Payment } from './dto/payment.dto';
import { Response } from 'express'
import { PaymentService } from './payment.service';
import * as mongoose from 'mongoose';

@Controller('payment')
export class PaymentController {
    constructor( private paymentService : PaymentService){}

    // GET /payment/conform
    @Post('conform') 
    async conformPayment (@Body('data') data : Payment, @Res() res : Response) {
        try {
            await this.paymentService.paymentSuccess(data, res)
        } catch (error) {
            return res.status(500).json({message : 'internal server error'})
        }
    }

    //
    @Get('subscribed')
    async subscribed (
        @Query('from') from : string,
        @Query('to') to : string,
        @Res() res : Response
    ){
        try {
            return await this.paymentService.subscribed(from, to, res)
        } catch (error) {
            return res.status(500).json({message : 'internal server error'})
        }
    }

    // GET payment/userhistory
    @Get('userhistory')
    async userHistory(
        @Body('userid') id : string,
        @Res() res : Response
    ){
        try {
            return await this.paymentService.getUserHistory(id,res)
        } catch (error) {
            return res.status(500).json({message : 'Internal server error'})
        }
    }

    // GET payment/professionalhistory
    @Get('professionalhistory')
    async professionalHistory(
        @Body('userid') id : string,
        @Res() res : Response
    ){
        try {
            return await this.paymentService.getProfessionalHistory(id,res)
        } catch (error) {
            return res.status(500).json({message : 'Internal server error'})
        }
    }
}
