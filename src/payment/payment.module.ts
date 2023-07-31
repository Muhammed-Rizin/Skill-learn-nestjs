import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { paymentSchema } from './schema/payment.model';

@Module({
  imports :[
    MongooseModule.forFeature([
      {name: 'Payment', schema: paymentSchema}
    ])
  ],
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule {}
