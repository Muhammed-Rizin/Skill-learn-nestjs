import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { scheduleSchema } from './schema/schedule.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Schedule', schema: scheduleSchema }]),
  ],
  providers: [ScheduleService],
  exports: [MongooseModule, ScheduleService],
})
export class ScheduleModule {}
