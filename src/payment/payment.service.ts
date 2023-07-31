import { Injectable, Res } from '@nestjs/common';
import { Payment } from './dto/payment.dto';
import { Response } from 'express'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PaymentService {
    constructor(@InjectModel('Payment') private readonly paymentModel : Model<Payment>){}
    async paymentSuccess(data : Payment, @Res() res : Response) {
        try {
            const newOrder = new this.paymentModel({
                amount: data.amount,
                from: data.from,
                paymentId: data.from,
                to: data.to
            })

            const result = await newOrder.save()

            return res.status(200).json(result)
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({message : 'internal server error'})
        }
    }
}
