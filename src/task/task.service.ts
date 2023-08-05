import { Injectable, Res } from '@nestjs/common';
import { Response } from 'express';

import { CompleteTask, Task } from './dto/task.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TaskService {
    constructor(
        @InjectModel('Task') private readonly _taskModel : Model<CompleteTask>
    ){}

    async addTask(task : Task, id : string, @Res() res : Response) {
        try {
            const data = new this._taskModel ({
                from : id,
                to : task.user,
                task : task.task,
                description : task.description,
                endtime : task.endtime
            })
            await data.save()
            return res.status(200).json({message : 'success'})
        } catch (error) {
            console.log(error.message)
            res.status(500).json({status: 'error', message: 'internal server error'}) 
        }
    }

    async getInprogressTasks(id : string, @Res() res : Response) {
        try {
            const now = new Date()
            const data = await this._taskModel.find({from : id, endtime :{$gte : now}}).populate('to')
            return res.status(200).json(data)
        } catch (error) {
            console.log(error.message)
            res.status(500).json({status: 'error', message: 'internal server error'}) 
        }
    }

    async getCompletedTasks(id : string, @Res() res : Response) {
        try {
            const now = new Date()
            const data = await this._taskModel.find({from : id, endtime :{$lte : now}}).populate('to')
            return res.status(200).json(data)
        } catch (error) {
            console.log(error.message)
            res.status(500).json({status: 'error', message: 'internal server error'}) 
        }
    }

    async getInprogressTaskOfUser(id : string, @Res() res : Response) {
        try {
            const now = new Date()
            const data = await this._taskModel.find({to : id, endtime :{$gte : now}}).populate('from')
            return res.status(200).json(data)
        } catch (error) {
            console.log(error.message)
            res.status(500).json({status: 'error', message: 'internal server error'}) 
        }
    }

    async getCompletedTasksByUser(id : string, @Res() res : Response) {
        try {
            const now = new Date()
            const data = await this._taskModel.find({to : id, endtime :{$lte : now}}).populate('from')
            return res.status(200).json(data)
        } catch (error) {
            console.log(error.message)
            res.status(500).json({status: 'error', message: 'internal server error'}) 
        }
    }

    async taskDone(id : string, @Res() res : Response) {
        try {
            const data = await this._taskModel.findByIdAndUpdate(id, {$set : {completed : true}})
            return res.status(200).json(data)
        } catch (error) {
            console.log(error.message)
            res.status(500).json({status: 'error', message: 'internal server error'}) 
        }
    }
}


