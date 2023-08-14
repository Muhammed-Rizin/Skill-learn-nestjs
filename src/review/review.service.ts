import { Injectable, Res } from '@nestjs/common';
import { Model } from 'mongoose';
import { Review, addReview } from './dto/review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';

@Injectable()
export class ReviewService {
    constructor(
        @InjectModel('Review') private readonly _reviewModel : Model<Review>
    ){}

    async addReview(professionalId: string, id : string, data : addReview, @Res() res : Response){
        try {
            const review = new this._reviewModel({
                title : data.title,
                description : data.description,
                rating: data.rating,
                user : id,
                professional : professionalId
            })
            
            const result = await review.save()
            return res.status(200).json(result)
        } catch (error) {
            return res.status(200).json({message : 'Internal server error'})
        }
    }

    async reviews(id: string, page : number, @Res() res : Response){
        try {
            const limit = 2
            const skip: number = (page - 1) * limit

            const data = await this._reviewModel.find({professional : id}).populate('user')
            .sort({createdAt : -1}).skip(skip).limit(limit)

            const total = (await this._reviewModel.find({professional : id}).populate('user')).length
            return res.status(200).json({data, total})
        } catch (error) {
            return res.status(200).json({message : 'Internal server error'})
            
        }
    }
}
