import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { MongooseModule } from '@nestjs/mongoose';
import { taskSchema } from './schema/task.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Task', schema: taskSchema }])],
  providers: [TaskService],
  exports: [MongooseModule, TaskService],
})
export class TaskModule {}
