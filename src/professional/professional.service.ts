import { Injectable, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as randomString from 'randomstring';

import { Professional } from './dto/professional.dto';
import { ForgotPasswordService } from 'src/mail/forgotPassword/forgotPassword.service';
import { VerificationService } from 'src/mail/verification/verification.service';
import { PaymentService } from 'src/payment/payment.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ProfessionalService {
  constructor(
    @InjectModel('Professional')
    private readonly professionalModel: Model<Professional>,
    private readonly jwt: JwtService,
    private forgetPassword: ForgotPasswordService,
    private verification: VerificationService,
    private _paymentService: PaymentService,
    private _cloudinaryService: CloudinaryService,
  ) {}
  async professionalLogin(
    email: string,
    password: string,
    @Res() res: Response,
  ) {
    try {
      const professionalData = await this.professionalModel.findOne({
        email: email,
      });
      if (!professionalData) {
        return res.status(404).json({ message: 'User not Found' });
      }

      if (professionalData.blocked === true) {
        return res.status(400).json({ message: 'This email id is blocked' });
      }
      const professionalPassword = await bcrypt.compare(
        password,
        professionalData.password,
      );
      if (!professionalPassword) {
        return res.status(400).json({ message: 'Password is incorrect' });
      }

      const payload = { _id: professionalData._id };
      const token = this.jwt.sign(payload);
      await this.professionalModel.findByIdAndUpdate(professionalData._id, {
        $set: { token: token },
      });

      const data = await this.professionalModel.findById(professionalData._id);
      return res.status(200).json(data);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // check email
  async checkEmail(email: string, @Res() res: Response) {
    try {
      const alreadyData = await this.professionalModel.findOne({
        email: email,
      });
      if (alreadyData) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      res.status(200).json({ message: 'success' });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async professionalRegister(data: Professional, @Res() res: Response) {
    try {
      const alreadyData = await this.professionalModel.findOne({
        email: data.email,
      });
      if (alreadyData) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const { email, password, firstName, lastName, education } = data;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const professionalData = new this.professionalModel({
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        education: education,
        location: ' ',
        qualification: ' ',
        bio: ' ',
        address: ' ',
        image: ' ',
        experience: ' ',
        payment: ' ',
        skill: ' ',
        field: ' ',
        work: ' ',
        about: ' ',
      });
      const result = await professionalData.save();
      const { _id } = result.toJSON();

      const payload = { _id: _id };
      const token = this.jwt.sign(payload);
      await this.professionalModel.findByIdAndUpdate(_id, { token: token });

      const newUser = await this.professionalModel.findById(result._id);
      res.json(newUser);
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ status: 'error', message: 'Professional register failed' });
    }
  }

  async professionalForgetPassword(email: string, @Res() res: Response) {
    try {
      const professionalData = await this.professionalModel.findOne({
        email: email,
      });
      if (!professionalData) {
        return res.status(404).json({ message: 'Email not registered' });
      }

      const token = randomString.generate(20);

      const sendMail = this.forgetPassword.professionalForgetPassword(
        professionalData.firstName,
        email,
        token,
      );
      if (sendMail) {
        await this.professionalModel.findByIdAndUpdate(professionalData._id, {
          token: token,
        });
        return res.status(200).json({ message: 'Check your email' });
      }
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }
  async professionalDetails(token: string, @Res() res: Response) {
    try {
      const professionalData = await this.professionalModel.findOne({
        token: token,
      });
      return res.status(200).json(professionalData);
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }
  async newPassword(password: string, token: string, @Res() res: Response) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const professionalData = await this.professionalModel.findOneAndUpdate(
        { token: token },
        { $set: { password: hashedPassword } },
      );

      const payload = { _id: professionalData._id };
      const jwtToken = this.jwt.sign(payload);
      const data = await this.professionalModel.findOneAndUpdate(
        { _id: professionalData._id },
        { $set: { token: jwtToken } },
      );
      return res.status(200).json(data);
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }
  async isBlocked(id: string, @Res() res: Response) {
    try {
      const data = await this.professionalModel.findById(id);
      return res.status(200).json(data.blocked);
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }

  async isApproved(id: string, @Res() res: Response) {
    try {
      const data = await this.professionalModel.findById(id);
      return res.status(200).json(data.approved);
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }

  async getProfessionalData(userId: string, @Res() res: Response) {
    try {
      const data = await this.professionalModel.findById(userId);
      return res.status(200).json(data);
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }

  async updateProfessionalData(data: Professional, @Res() res: Response) {
    try {
      const userData = await this.professionalModel.findByIdAndUpdate(
        data._id,
        { $set: data },
      );
      return res.status(200).json(data);
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }

  async verifyEmail(id: string, token: string, @Res() res: Response) {
    try {
      const verified = await this.professionalModel.findOne({
        _id: id,
        emailToken: token,
      });
      if (verified) {
        await this.professionalModel.findByIdAndUpdate(id, {
          $set: { emailVerified: true },
        });
        return res.status(200).json({ message: 'success' });
      } else {
        return res.status(404).json({ message: 'invalid token' });
      }
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }

  async sendVerifyEmail(userId: string, @Res() res: Response) {
    try {
      const userData = await this.professionalModel.findById(userId);
      if (!userData) {
        return res.status(404).json({ message: 'Email not registered' });
      }
      const token = randomString.generate(30);

      const sendMail = await this.verification.professionalVerifyEmail(
        userData.firstName,
        userData.email,
        token,
      );
      if (sendMail) {
        await this.professionalModel.findByIdAndUpdate(userData._id, {
          emailToken: token,
        });
        return res.status(200).json({ message: 'Check your email' });
      }
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }

  async submitImage(
    userId: string,
    file: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      const imageUrl = await this._cloudinaryService.uploadImage(file);
      await this.professionalModel.findByIdAndUpdate(userId, {
        $set: { image: imageUrl },
      });
      return res.status(200).json({ message: 'success' });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }

  async setNotification(id: string, token: string, @Res() res: Response) {
    try {
      await this.professionalModel.findByIdAndUpdate(id, {
        $set: { notificationToken: token },
      });
      res.status(200).json({ message: 'success' });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ status: 'error', message: 'internal server error' });
    }
  }
}
