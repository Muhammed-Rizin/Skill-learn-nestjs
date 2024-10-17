import { Injectable, Res } from '@nestjs/common';
import { Response } from 'express';

import { CompleteTask, Task } from './dto/task.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel('Task') private readonly _taskModel: Model<CompleteTask>,
  ) {}

  async addTask(task: Task, id: string, @Res() res: Response) {
    try {
      const data = new this._taskModel({
        from: id,
        to: task.user,
        task: task.task,
        description: task.description,
        endTime: task.endTime,
      });
      await data.save();
      return res.status(200).json({ message: 'success' });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }

  async getInprogressTasks(id: string, page: number, @Res() res: Response) {
    try {
      const limit = 5;
      const skip: number = (page - 1) * limit;
      const now = new Date();

      const data = await this._taskModel
        .find({ from: id, endTime: { $gte: now } })
        .populate('to')
        .sort({ endTime: 1 })
        .skip(skip)
        .limit(limit);
      const total = (
        await this._taskModel
          .find({ from: id, endTime: { $gte: now } })
          .populate('to')
      ).length;

      return res.status(200).json({ data, total });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }

  async getCompletedTasks(id: string, page: number, @Res() res: Response) {
    try {
      const limit = 5;
      const skip: number = (page - 1) * limit;
      const now = new Date();

      const data = await this._taskModel
        .find({ from: id, endTime: { $lte: now } })
        .populate('to')
        .sort({ endTime: -1 })
        .skip(skip)
        .limit(limit);
      const total = (
        await this._taskModel
          .find({ from: id, endTime: { $lte: now } })
          .populate('to')
      ).length;
      return res.status(200).json({ data, total });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }

  async getInprogressTaskOfUser(
    id: string,
    page: number,
    @Res() res: Response,
  ) {
    try {
      const limit = 5;
      const skip: number = (page - 1) * limit;
      const now = new Date();

      const data = await this._taskModel
        .find({ to: id, endTime: { $gte: now } })
        .populate('from')
        .sort({ endTime: 1 })
        .skip(skip)
        .limit(limit);

      const total = (
        await this._taskModel
          .find({ to: id, endTime: { $gte: now } })
          .populate('from')
      ).length;

      return res.status(200).json({ data, total });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }

  async getCompletedTasksOfUser(
    id: string,
    page: number,
    @Res() res: Response,
  ) {
    try {
      const limit = 5;
      const skip: number = (page - 1) * limit;
      const now = new Date();

      const data = await this._taskModel
        .find({ to: id, endTime: { $lte: now } })
        .populate('from')
        .sort({ endTime: -1 })
        .skip(skip)
        .limit(limit);

      const total = (
        await this._taskModel
          .find({ to: id, endTime: { $lte: now } })
          .populate('from')
      ).length;
      return res.status(200).json({ data, total });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }

  async taskDone(id: string, @Res() res: Response) {
    try {
      const data = await this._taskModel
        .findByIdAndUpdate(id, { $set: { completed: true } })
        .sort({ endTime: 1 });
      return res.status(200).json(data);
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }
}
