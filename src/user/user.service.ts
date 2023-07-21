import { HttpStatus, Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as dotenv from 'dotenv';
dotenv.config()

import { User } from './user.model';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly userModel : Model<User>,
        private readonly jwt : JwtService
    ){}

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
            const alreadyData = await this.userModel.findOne({email : data.email})
            if(alreadyData){
                return res.status(400).json({message : 'Email already registered'})
            }

            const { email, password, firstName, lastName, education} = data 
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            const userData = new this.userModel ({
                email: email,
                password: hashedPassword,
                firstName: firstName,
                lastName: lastName,
                education: education,
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
}
