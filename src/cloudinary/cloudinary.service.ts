import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('cloudinary.cloudName'),
      api_key: this.configService.get<string>('cloudinary.apiKey'),
      api_secret: this.configService.get<string>('cloudinary.apiSecret'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const imageAsBase64 = file.buffer.toString('base64');
      const dataURI = `data:text/plain;base64,${imageAsBase64}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'profile-images',
      });
      return result.secure_url;
    } catch (error) {
      console.log(error.message);
    }
  }
}
