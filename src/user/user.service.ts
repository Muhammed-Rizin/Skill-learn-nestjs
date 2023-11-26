import { HttpStatus, Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as randomstring from 'randomstring'
import * as dotenv from 'dotenv';
dotenv.config()

import { User } from './dto/user.dto';
import { ForgotPasswordService } from 'src/mail/forgotPassword/forgotPassword.service';
import { Professional } from 'src/professional/dto/professional.dto';
import { VerificationService } from 'src/mail/verification/verification.service';
import * as path from 'path';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly userModel : Model<User>,
        @InjectModel('Professional') private readonly professionalModel : Model<Professional>,
        private readonly jwt : JwtService,
        private forgetPassword : ForgotPasswordService,
        private verification : VerificationService,
        private readonly _cloudinaryService : CloudinaryService
    ){}

    // check email
    async checkEmail(email : string, @Res() res :Response){
        try {
            const alreadyData = await this.userModel.findOne({email :email})
            if(alreadyData){
                return res.status(400).json({message : 'Email already registered'})
            }
        
            res.status(200).json({message : 'success'})
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // User login 
    async userLogin(email : string, password : string, @Res() res: Response) {
        try {

            const userData = await this.userModel.findOne({email : email})
            if(!userData){
                return res.status(404).json({message : 'User not Found'})
            }

            if(userData.blocked === true){
                return res.status(400).json({ message: 'This email id is blocked' });
            }

            const userPassword = await bcrypt.compare(password, userData.password)
            if(!userPassword){
                return res.status(400).json({ message: 'Password is incorrect' });
            }

            const payload = { _id: userData._id };
            const token = this.jwt.sign(payload);
            await this.userModel.findByIdAndUpdate(userData._id,{$set : {token : token}})

            const data = await this.userModel.findById(userData._id)
            return res.status(200).json(data)

        } catch (error) {
            console.log(error.message)
            res.status(500).json({ message: 'Internal server error' });
        }
        

    }

    // User Register
    async userRegister(data : User, @Res() res : Response){
        try {
            const { email, password, firstName, lastName, education} = data 
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            const userData = new this.userModel ({
                email: email,
                password: hashedPassword,
                firstName: firstName,
                lastName: lastName,
                education: education,
                location: ' ',
                bio : ' ',
                address : ' ',
                image : ' '
            })

            const result = await userData.save()
            const {_id } = result.toJSON()

            const payload = { _id: _id };
            const token = this.jwt.sign(payload);
            await this.userModel.findByIdAndUpdate(_id, {token : token})
            
            const newUser = await this.userModel.findById(result._id)
            res.json(newUser)

        } catch (error) {
            console.log(error.message)
            res.status(500).json({ status: 'error', message: 'User register failed' });
        }
    }


    // forget password 
    async userForgotPassword(email : string, @Res() res : Response){
        try {
            const userData = await this.userModel.findOne({email : email})
            if(!userData){
                return res.status(404).json({message : 'Email not registered'})
            }

            const token = randomstring.generate(20)

            const sendMail = this.forgetPassword.forgetPassword(userData.firstName, email, token)
            if(sendMail){
                await this.userModel.findByIdAndUpdate(userData._id, {token : token})
                return res.status(200).json({message : 'Check your email'})
            }
            
        } catch (error) {
            console.log(error.message)
            res.status(500).json({status: 'error', message: 'internal server error'})
        }
    }

    async userDetails(token : string, @Res() res : Response) {
        try {
            const userData =  await this.userModel.findOne({token : token})
            return res.status(200).json(userData)
        } catch (error) {
            console.log(error.message)
            res.status(500).json({status: 'error', message: 'internal server error'})
        }
    }

    async newPassword(password : string, token : string, @Res() res : Response){
        try {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            const userData = await this.userModel.findOneAndUpdate({token : token}, {$set : {password : hashedPassword}})

            const payload = { _id: userData._id };
            const jwtToken = this.jwt.sign(payload);
            const data = await this.userModel.findOneAndUpdate({_id : userData._id},{$set : {token : jwtToken}})
            return res.status(200).json(data)
        } catch (error) {
            console.log(error.message)
            res.status(500).json({status: 'error', message: 'internal server error'})
        }
    }

    async sendVerifyEmail(userId : string, @Res() res : Response) {
        try {
            const userData = await this.userModel.findById(userId)
            if(!userData){
                return res.status(404).json({message : 'Email not registered'})
            }
            const token = randomstring.generate(30)

            const sendMail = await this.verification.userVerifyEmail(userData.firstName, userData.email, token)
            if(sendMail){
                await this.userModel.findByIdAndUpdate(userData._id, {emailToken : token})
                return res.status(200).json({message : 'Check your email'})
            }
        } catch (error) {
            console.log(error.message)
            res.status(500).json({status: 'error', message: 'internal server error'})
        }
    }

    async isBlocked(id :string, @Res() res : Response) {
        try {
            const data = await this.userModel.findById(id)
            return res.status(200).json( data.blocked)
        } catch (error) {
            console.log(error.message)
            res.status(500).json({status: 'error', message: 'internal server error'})
        }
    }

    async userData(id : string, @Res() res : Response) {
        try {
            const userData = await this.userModel.findById(id)
            return res.status(200).json(userData)
        } catch (error) {
            console.log(error.message)
            res.status(500).json({status: 'error', message: 'internal server error'})
        }
    }

    async userDataByEmail(email : string, @Res() res : Response) {
        try {
            const userData = await this.professionalModel.findOne({email : email})
            if(userData){
                return res.status(200).json(userData)
            }
            return res.status(404).json({message : 'Not valid'})
        } catch (error) {
            console.log(error.message)
            res.status(500).json({status: 'error', message: 'internal server error'})
        }
    }

    async professionalData(id : string, @Res() res : Response) {
        try {
            const userId = new mongoose.Types.ObjectId(id)
            const userData = await this.professionalModel.findById(userId)
            if(userData){
                return res.status(200).json(userData)
            }
            return res.status(404).json({message : 'Not valid'})
        } catch (error) {
            console.log(error.message)
            res.status(500).json({status: 'error', message: 'internal server error'})
        }
    }

    async userByEmail (email : string, @Res() res : Response) {
        try {
            const userData = await this.userModel.findOne({email : email})
            if(userData){
                return res.status(200).json(userData)
            }
            return res.status(404).json({message : 'Not valid'})
        } catch (error) {
            console.log(error.message)
            res.status(500).json({status: 'error', message: 'internal server error'})
        }
    }

    async updateUser(userId : string, userData : User, @Res() res : Response) {
        try {
            await this.userModel.findByIdAndUpdate(userData._id, {$set : userData})
            return res.status(200).json(userData)
        } catch (error) {
            console.log(error.message)
            res.status(500).json({status: 'error', message: 'internal server error'})
        }
    }

    async verifyEmail(id : string, token : string, @Res() res : Response) {
        try {
            const verified = await this.userModel.findOne({_id : id, emailToken : token})
            if(verified){
                const d = await this.userModel.findByIdAndUpdate(id, {$set : {emailVerified : true}})
                return res.status(200).json({message : 'success'})
            }
        } catch (error) {
            console.log(error.message)
            res.status(500).json({status: 'error', message: 'internal server error'})
        }
    }
    async getProfessionals(@Res() res : Response) {
        try {
            const professionalsWithRatings = await this.professionalModel.aggregate([
                {
                  $match: {
                    approved: true,
                    blocked: false,
                  },
                },
                {
                  $lookup: {
                    from: 'reviews', // Name of the "Review" collection
                    localField: '_id',
                    foreignField: 'professional',
                    as: 'reviews',
                  },
                },
                {
                  $unwind: {
                    path: '$reviews',
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                    $group: {
                      _id: '$_id',
                      professional: { $first: '$$ROOT' }, // Include the entire professional document
                      averageRating: { $avg: '$reviews.rating' },
                    },
                  },
                  {
                    $replaceRoot: {
                      newRoot: {
                        $mergeObjects: ['$professional', { averageRating: '$averageRating' }],
                      },
                    },
                  },
                  {
                    $sort: {
                      _id: 1, // Sort by the professional's _id in ascending order
                    },
                  }
              ]);
              return res.status(200).json({ data: professionalsWithRatings });
              
        } catch (error) {
            console.log(error.message)
            res.status(500).json({status: 'error', message: 'internal server error'})
        }
    }

    async submitImage(userId : string, file : Express.Multer.File, @Res() res : Response){
        try {
            const imageUrl = await this._cloudinaryService.uploadImage(file)
            await this.userModel.findByIdAndUpdate(userId, { $set : {image : imageUrl}})
            return res.status(200).json({message : 'success'})
        } catch (error) {
            console.log(error.message)
            res.status(500).json({status: 'error', message: 'internal server error'})
        }
    }
    
    async setNotification(id : string, token : string, @Res() res : Response){
        try {
            await this.userModel.findByIdAndUpdate(id, {$set : {notificationToken : token}})
        } catch (error) {
            console.log(error.message)
            res.status(500).json({status: 'error', message: 'internal server error'})
        }
    }
}
