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
        const { roomName, message, from, to, type, receiverType } = messageDto;
        const data = this.messageModel.findOneAndUpdate(
            { roomId: roomName },
            {
                $push: {
                    messages: {
                        text: message,
                        sender: from,
                        senderType: type,
                        time: new Date(),
                        receiverType : receiverType,
                        receiver : to,
                    },
                },
                $addToSet: { users: [from, to] },
                
            },
            { upsert: true, new: true },
        );

        if(type === "User"){
            this.updateProfessionalStatusAsUnread(roomName)
        }else {
            this.updateUserStatusAsUnread(roomName)
        }
        return data
    }

    async findMessageByRoomId(roomName: string): Promise<Message> {
        return this.messageModel
          .findOne({ roomId: roomName })
          .populate('messages.sender')
          .populate('messages.receiver');
    }


    async updateUserStatusAsUnread(roomId: string) {
        try{
            await this.messageModel.findOneAndUpdate({roomId : roomId}, {$set : {userRead : false}})
        }catch(error){
            console.log(error.message)
        }
    } 
    async updateProfessionalStatusAsUnread(roomId: string) {
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

    async getChats(userId: string, @Res() res: Response) {
        try {
            
            const chatDetails = await this.messageModel.find({ $or: [{ 'messages.sender': userId }, { users: userId }] })
                .populate('messages.sender').populate('messages.receiver')

            res.status(200).json(chatDetails)
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: 'internal server error' })
        }
    }

    async getChatHistory(roomId: string, page : number, limit : number, @Res() res: Response) {
        try {
            limit = Number(limit)
            const skip = (page - 1) * limit
            const chatData = await this.messageModel.findOne({ roomId: roomId }).populate('messages.sender').populate('messages.receiver')
            // const actualChat = await this.messageModel.findOne({roomId})
            
            if(!chatData){
                return res.status(404).json({message : "Invalid roomId"})
            }
            const total = chatData.messages.length
            const start = total - (skip + limit as number) >0 ? total - (skip + limit as number) : 0
            chatData.messages = chatData.messages.slice(start, total - skip)
        
            return res.status(200).json({chatData, total})
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

