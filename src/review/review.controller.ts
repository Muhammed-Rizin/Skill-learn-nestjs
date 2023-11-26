import { Controller, Post, Body, Get, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { addReview } from './dto/review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
    constructor(
        private reviewService : ReviewService
    ){}
    // POST review/addreview
    @Post('addreview') 
    async addReview(
        @Body('id') professionalId : string,
        @Body('data') data : addReview,
        @Body('userId') userId : string,
        @Res() res : Response
    ) {
        try {
            this.reviewService.addReview(professionalId ,userId, data, res) 
        } catch (error) {
            console.log(error.message)
            return res.status(200).json({message : 'Internal server error'})
        }
    }

    // GET review/getreviews
    @Get('getreviews') 
    async getReview(
        @Query('page') page : number,
        @Query('id') id : string, 
        @Res() res : Response
    ) {
        try {
            return this.reviewService.reviews(id, page,res)
        } catch (error) {
            console.log(error.message)
            return res.status(200).json({message : 'Internal server error'})
        }
    }

    // GET review/professionalreviews
    @Get('professionalreviews') 
    async getProfessionalReview(
        @Query('page') page : number,
        @Query('id') id : string, 
        @Res() res : Response
    ) {
        try {
            return this.reviewService.reviews(id, page,res)
        } catch (error) {
            console.log(error.message)
            return res.status(200).json({message : 'Internal server error'})
        }
    }
}
