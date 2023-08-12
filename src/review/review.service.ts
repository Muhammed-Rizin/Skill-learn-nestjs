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

    async reviews(id: string, @Res() res : Response){
        try {
            const data = await this._reviewModel.find({professional : id}).populate('user')
            return res.status(200).json(data)
        } catch (error) {
            return res.status(200).json({message : 'Internal server error'})
            
        }
    }
}
