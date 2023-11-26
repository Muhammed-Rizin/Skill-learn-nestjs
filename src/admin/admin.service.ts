import { Injectable, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, mongo, set } from 'mongoose';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt'

import { Admin, Professional, User } from './dto/admin.dto';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel('Admin') private readonly adminModel : Model<Admin>,
        @InjectModel('User') private readonly userModel : Model<User>,
        @InjectModel('Professional') private readonly professionalModel : Model<Professional>,
        private jwt : JwtService
    ){}

    async adminLogin(email : string, password : string, @Res() res: Response) {
        try {
            const adminData = await this.adminModel.findOne({email : email})
            if(!adminData || adminData.password !== password){
                return res.status(404).json({message : 'Email or password is incorrect'})
            }

            const payload = { _id: adminData._id };
            const token = this.jwt.sign(payload)
            await this.adminModel.findByIdAndUpdate(adminData._id, {token : token})

            const data = await this.adminModel.findById(adminData._id)
            return res.status(200).json(data)
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getTotalUsers(@Res() res : Response){
        try {
            const userData = await this.findUsers(res)
            return res.status(200).json(userData)
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({status : 'error', message : 'User fetching failed'})
        }
    }

    async getTotalProfessionals(@Res() res : Response){
        try {
            const professionalData = await this.findProfessionals(res)
            return res.status(200).json(professionalData)
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({status : 'error', message : 'Professional fetching failed'})
        }
    }

    async getTotalRequestedProfessionals(@Res() res : Response){
        try {
            const professionalData = await this.professionalModel.find({approved : false})
            return res.status(200).json(professionalData)
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({status : 'error', message : 'Requested professional failed'})
        }
    }


    async getUsers(page : number, limit : number, @Res() res : Response){
        try {
            const skip = (page - 1) * limit

            const userData = await this.userModel.find().skip(skip).limit(limit)
            return res.status(200).json(userData)
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({status : 'error', message : 'User fetching failed'})
        }
    }

    async getProfessionals(page : number, limit : number, @Res() res : Response){
        try {
            const skip = (page - 1) * limit
            const professionalData = await this.professionalModel.find({approved : true}).skip(skip).limit(limit)
            // const totalProfessional = await this.professionalModel.find({approved : true}).skip(skip).limit(limit)
            return res.status(200).json(professionalData)
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({status : 'error', message : 'Professional fetching failed'})
        }
    }

    async getRequestedProfessionals(page : number, limit : number, @Res() res : Response){
        try {
            const skip = (page - 1) * limit

            const professionalData = await this.professionalModel.find({approved : false}).skip(skip).limit(limit)
            return res.status(200).json(professionalData)
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({status : 'error', message : 'Requested professional failed'})
        }
    }

    async blockUser(id : string, @Res() res : Response){
        try {
            await this.userModel.findByIdAndUpdate(id, {$set : {blocked : true}})
            return res.status(200).json(id)
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({status : 'error', message : 'User blocking failed'})
        }
    }

    async unblockUser(id : string, @Res() res : Response){
        try {
            await this.userModel.findByIdAndUpdate(id, {blocked : false})
            return res.status(200).json(id)
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({message : 'User unblocking failed'})
        }
    }

    async approveProfessionals(id : string, @Res() res : Response){
        try {
            const professionalId = new mongoose.Types.ObjectId(id)
            await this.professionalModel.findByIdAndUpdate(professionalId, {$set : {approved : true, rejected : false}})

            return res.status(200).json(id)
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({message : 'Professional approving failed'})
        }
    }

    async rejectProfessionals(professionalId : string, @Res() res :Response){
        try {
            const id = new mongoose.Types.ObjectId(professionalId)
            await this.professionalModel.findByIdAndUpdate(id, {$set : {rejected : true}})

            return res.status(200).json(id)
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({message : 'Professional rejection failed'})
        }
    }


    async blockProfessionals(professionalId : string, @Res() res : Response){
        try {
            const id = new mongoose.Types.ObjectId(professionalId)
            await this.professionalModel.findByIdAndUpdate(id, {blocked : true})
            return res.status(200).json(id)
        } catch (error) {
            console.log(error.message)
            res.status(500).json({status : 'error', message : 'Professional blocking failed'})
        }
    }

    async unblockProfessionals(professionalId : string, @Res() res : Response){
        try {
            const id = new mongoose.Types.ObjectId(professionalId)
            await this.professionalModel.findByIdAndUpdate(id, {blocked : false})
            
            return res.status(200).json(id)
        } catch (error) {
            console.log(error.message)
            res.status(500).json({status : 'error', message : 'Professional unblocking failed'})
        }
    }


    async findUsers(@Res() res : Response){
        try {
            return await this.userModel.find()
        } catch (error) {
            return res.status(500).json({status : 'error', message : 'User fetching failed'})
        }
    }

    async findProfessionals(@Res() res : Response){
        try {
            return await this.professionalModel.find({approved : true})
        } catch (error) {
            return res.status(500).json({status : 'error', message : 'Professional fetching failed'})
        }
    }
}
