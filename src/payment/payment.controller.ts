import { Body, Controller, Post, Res } from '@nestjs/common';
import { Payment } from './dto/payment.dto';
import { Response } from 'express'
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
    constructor( private paymentService : PaymentService){}
    @Post('conform') 
    async conformPayment (@Body('data') data : Payment, @Res() res : Response) {
        try {
            await this.paymentService.paymentSuccess(data, res)
        } catch (error) {
            return res.status(500).json({message : 'internal server error'})
        }
    }
}
