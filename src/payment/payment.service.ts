import { Injectable, Res } from '@nestjs/common';
import { Payment } from './dto/payment.dto';
import { Response } from 'express'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose'

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

    async subscribed(from :string , to :string , @Res() res : Response){
        try {
            const fromUser = new mongoose.Types.ObjectId(from)
            const toUser = new mongoose.Types.ObjectId(to)
            const data = await this.paymentModel.find({from : fromUser, to : toUser})

            return res.status(200).json(data[data.length - 1])
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({message : 'internal server error'})
        }
    }


    async getSubscribedUsers(id : string, @Res() res : Response){
        try {
            const data = await this.paymentModel.find({to : id}).populate('from')
            return res.status(200).json(data)
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({message : 'internal server error'})
        }
    }

    async getUserHistory(id : string, page :number, limit : number, @Res() res : Response) {
        try {
            const skip = (page - 1) * limit

            const data = await this.paymentModel.find({from : id}).populate('to').sort({createdAt : -1}).skip(skip).limit(limit)
            const total = (await this.paymentModel.find({from : id})).length
            
            return res.status(200).json({data, total})
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({message : 'Internal server error'})
        }
    }

    async getProfessionalHistory(id : string, page : number, limit : number , @Res() res : Response) {
        try {
            const skip = (page - 1) * limit

            const data = await this.paymentModel.find({to : id}).populate('from').sort({createdAt : 1}).skip(skip).limit(limit)
            const total = (await this.paymentModel.find({to : id})).length

            return res.status(200).json({data, total})
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({message : 'Internal server error'})
        }
    }
}
