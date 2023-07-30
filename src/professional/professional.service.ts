import { Injectable, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as randomstring from 'randomstring'

import { Professional } from './professional.model';
import { ForgetpasswordService } from 'src/mail/forgetpassword/forgetpassword.service';

@Injectable()
export class ProfessionalService {
    constructor(
        @InjectModel('Professional') private readonly professionalModel : Model<Professional>,
        private readonly jwt : JwtService,
        private forgetPassword : ForgetpasswordService
    ){}
    async professionalLogin(email : string, password : string, @Res() res : Response){
        try {

            const professionalData = await this.professionalModel.findOne({email : email})
            if(!professionalData){
                return res.status(404).json({message : 'User not Found'})
            }

            if(professionalData.blocked === true){
                return res.status(400).json({ message: 'This email id is blocked' });
            }
            const professionalPassword = await bcrypt.compare(password, professionalData.password)
            if(!professionalPassword){
                return res.status(400).json({ message: 'Password is incorrect' });
            }

            const payload = { _id: professionalData._id };
            const token = this.jwt.sign(payload);
            await this.professionalModel.findByIdAndUpdate(professionalData._id,{$set : {token : token}})

            const data = await this.professionalModel.findById(professionalData._id)
            return res.status(200).json(data)

        } catch (error) {
            console.log(error.message)
            res.status(500).json({ message: 'Internal server error' });
        }
    }


    async professionalRegister(data : Professional, @Res() res : Response){
        try {
            const alreadyData = await this.professionalModel.findOne({email : data.email})
            if(alreadyData){
                return res.status(400).json({message : 'Email already registered'})
            }

            const { email, password, firstName, lastName, education} = data 
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            const professionalData = new this.professionalModel ({
                email: email,
                password: hashedPassword,
                firstName: firstName,
                lastName: lastName,
                education: education,
            })
            const result = await professionalData.save()
            const {_id } = result.toJSON()

            const payload = { _id: _id };
            const token = this.jwt.sign(payload);
            await this.professionalModel.findByIdAndUpdate(_id, {token : token})
            
            const newUser = await this.professionalModel.findById(result._id)
            res.json(newUser)

        } catch (error) {
            console.log(error.message)
            res.status(500).json({ status: 'error', message: 'Professional register failed' });
        }
    }

    async professionalforgetPassword(email : string, @Res() res : Response){
        try {
            const professionalData = await this.professionalModel.findOne({email : email})
            if(!professionalData){
                return res.status(404).json({message : 'Email not registered'})
            }

            const token = randomstring.generate(20)

            const sendMail = this.forgetPassword.professionalForgetPassword(professionalData.firstName, email, token)
            if(sendMail){
                await this.professionalModel.findByIdAndUpdate(professionalData._id, {token : token})
                return res.status(200).json({message : 'Check your email'})
            }
            
        } catch (error) {
            console.log(error)
            res.status(500).json({status: 'error', message: 'internal server error'})
        }
    }
    async professionalDetails(token : string, @Res() res : Response){
        try {
            const professionalData =  await this.professionalModel.findOne({token : token})
            return res.status(200).json(professionalData)
        } catch (error) {
            console.log(error)
            res.status(500).json({status: 'error', message: 'internal server error'})
        }
    }
    async newPassword(password : string ,token : string, @Res() res : Response){
        try {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            const professionalData = await this.professionalModel.findOneAndUpdate({token : token}, {$set : {password : hashedPassword}})

            const payload = { _id: professionalData._id };
            const jwttoken = this.jwt.sign(payload);
            const data = await this.professionalModel.findOneAndUpdate({_id : professionalData._id},{$set : {token : jwttoken}})
            return res.status(200).json(data)
        } catch (error) {
            console.log(error)
            res.status(500).json({status: 'error', message: 'internal server error'})
        }
    }
    async isBlocked(id :string, @Res() res : Response) {
        try {
            const data = await this.professionalModel.findById(id)
            return res.status(200).json( data.blocked)
        } catch (error) {
            console.log(error)
            res.status(500).json({status: 'error', message: 'internal server error'})
        }
    }

    async isApproved(id :string, @Res() res : Response) {
        try {
            const data = await this.professionalModel.findById(id)
            return res.status(200).json( data.approved)
        } catch (error) {
            console.log(error)
            res.status(500).json({status: 'error', message: 'internal server error'})
        }
    }
}
