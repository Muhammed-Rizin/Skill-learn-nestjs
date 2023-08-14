import { Injectable, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'express';

import { Message } from './schema/chat.model';
import { MessageDto } from './dto/chat.dto';
import { Video } from './dto/video.dto';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel('Message') private readonly messageModel: Model<Message>,
        @InjectModel('Call') private readonly callModel: Model<Video>,
        ) { }

    async saveMessage(messageDto: MessageDto): Promise<Message> {
        const { roomName, message, from, to, type, receverType } = messageDto;
        const data = this.messageModel.findOneAndUpdate(
            { roomId: roomName },
            {
                $push: {
                    messages: {
                        text: message,
                        sender: from,
                        senderType: type,
                        time: new Date(),
                        receverType : receverType,
                        recever : to,
                    },
                },
                $addToSet: { users: [from, to] },
                
            },
            { upsert: true, new: true },
        );

        if(type === "User"){
            this.updateProfessionalStatusAsUnreed(roomName)
        }else {
            this.updateUserStatusAsUnreed(roomName)
        }
        return data
    }

    async findMessageByRoomId(roomName: string): Promise<Message> {
        return this.messageModel
          .findOne({ roomId: roomName })
          .populate('messages.sender')
          .populate('messages.recever');
    }


    async updateUserStatusAsUnreed(roomId: string) {
        try{
            await this.messageModel.findOneAndUpdate({roomId : roomId}, {$set : {userRead : false}})
        }catch(error){
            console.log(error.message)
        }
    } 
    async updateProfessionalStatusAsUnreed(roomId: string) {
        try{
            await this.messageModel.findOneAndUpdate({roomId : roomId}, {$set : {professionalRead : false}})
        }catch(error){
            console.log(error.message)
        }
    } 

    async updateStatusUser(roomId : string,@Res() res : Response){
        try {
            await this.messageModel.findOneAndUpdate({roomId : roomId}, {$set : {userRead : true}})
            return res.status(200).json({message : 'success'})
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: 'internal server error' })
        }
    }

    async updateStatusProfessional(roomId : string,@Res() res : Response){
        try {
            await this.messageModel.findOneAndUpdate({roomId : roomId}, {$set : {professionalRead : true}})
            return res.status(200).json({message : 'success'})
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: 'internal server error' })
        }
    }

    async getChats(userid: string, @Res() res: Response) {
        try {
            const chatDetails = await this.messageModel.find({ $or: [{ 'messages.sender': userid }, { users: userid }] })
                .populate('messages.sender').populate('messages.recever')
            res.status(200).json(chatDetails)
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: 'internal server error' })
        }
    }

    async getChatHistory(roomId: string, @Res() res: Response) {
        try {
            const chatData = await this.messageModel.findOne({ roomId: roomId }).populate('messages.sender').populate('messages.recever')
            return res.status(200).json(chatData)
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: 'internal server error' })
        }
    }

    async addCall(room : string, from : string, to : string) {
        try {
            const call = new this.callModel({
                room : room,
                from : from,
                to : to,
                status : 'incoming'
            })

            const result = await call.save()
            return result
    
        } catch (error) {
            console.log(error.message)
        }
    }
}

