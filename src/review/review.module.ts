import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { reviewSchema } from './schema/review.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Review', schema: reviewSchema }]),
  ],
  providers: [ReviewService],
  controllers: [ReviewController],
  exports: [ReviewService, MongooseModule],
})
export class ReviewModule {}
