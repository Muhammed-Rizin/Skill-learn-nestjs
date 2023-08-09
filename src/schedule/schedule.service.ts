import { Injectable, Res } from '@nestjs/common';
import { Model } from 'mongoose';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';

import { CompleteSchedule, Schedule } from './dto/schedule.dto';

@Injectable()
export class ScheduleService {
    constructor(
        @InjectModel('Schedule') private readonly _scheduleSchema : Model<CompleteSchedule>
    ){}

    async scheduleMeeting(meeting : Schedule, id : string, @Res() res : Response) {
        try {
            const data = new this._scheduleSchema ({
                from : id,
                to : meeting.user,
                topic : meeting.topic,
                description : meeting.description,
                time : meeting.time
            })
            await data.save()
            return res.status(200).json({message : 'success'})
        } catch (error) {
            console.log(error.message)
            res.status(500).json({status: 'error', message: 'internal server error'}) 
        }
    }

    async getInprogress(id : string, @Res() res : Response) {
        try {
            const now = new Date()
            const data = await this._scheduleSchema.find({from : id, time :{$gte : now}}).populate('to').sort({time : 1})
            return res.status(200).json(data)
        } catch (error) {
            console.log(error.message)
            res.status(500).json({status: 'error', message: 'internal server error'}) 
        }
    }

    async getCompleted(id : string, @Res() res : Response) {
        try {
            const now = new Date()
            const data = await this._scheduleSchema.find({from : id, time :{$lte : now}}).populate('to').sort({time : 1})
            return res.status(200).json(data)
        } catch (error) {
            console.log(error.message)
            res.status(500).json({status: 'error', message: 'internal server error'}) 
        }
    }

    async getInprogressOfUser(id : string, @Res() res : Response) {
        try {
            const now = new Date()
            const data = await this._scheduleSchema.find({to : id, time :{$gte : now}}).populate('from').sort({time : 1})
            return res.status(200).json(data)
        } catch (error) {
            console.log(error.message)
            res.status(500).json({status: 'error', message: 'internal server error'}) 
        }
    }
    async getCompletedOfUser(id : string, @Res() res : Response) {
        try {
            const now = new Date()
            const data = await this._scheduleSchema.find({to : id, time :{$lte : now}}).populate('from').sort({time : 1})
            return res.status(200).json(data)
        } catch (error) {
            console.log(error.message)
            res.status(500).json({status: 'error', message: 'internal server error'}) 
        }
    }
}
