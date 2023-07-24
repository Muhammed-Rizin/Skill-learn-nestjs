import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ForgetpasswordService {
    private readonly transporter;
    constructor(){
        this.transporter = nodemailer.createTransport({
            host: process.env.host,
            post: process.env.post,
            secure: process.env.secure,
            requireTLS: process.env.requireTLS,
            auth: {
                user: process.env.user,
                pass: process.env.pass
            }
        });
    }

    forgetPassword(userName : string, email : string, token) {
        const mailOptions = {
            from: 'Skill learn <onboarding@resend.dev>',
            to: [email],
            subject: 'New Password',
            html: `<!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Skill-learn</title>
                <style>
                    .content {
                        /* CSS for body goes here */
                        display: flex;
                        width: 100%;
                        height: 100vh;
                        align-items: center;
                        justify-content: center;
                        padding: 10% 0 0 20%;
                        margin: 0;
                        background: #000;
                    }
            
                    .field {
                        /* CSS for .field goes here */
                        background-color: #0000;
                        color: #fff;
                        width: 440px;
                        height: 577.9px;
                        flex-shrink: 0;
                        padding: 20px;
                    }
            
                    h1 {
                        /* CSS for h1 goes here */
                        color: #FFF;
                        font-family: 'Roboto', sans-serif;
                        font-size: 24px;
                        font-style: normal;
                        font-weight: 600;
                        line-height: 40px;
                    }
            
                    a,
                    button {
                        text-decoration: none;
                        border: none;
                        outline: none;
                        color: black;
                    }
            
                    p {
                        /* CSS for p goes here */
                        color: #AAA;
                        font-family: 'Roboto', sans-serif;
                        font-size: 13px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 24px;
                    }
            
                    button {
                        display: inline-block;
                  margin-top: 20px;
                  padding: 16.2px 66.74px 15.6px 66.26px;
                  border-radius: 8px;
                  background: #1f7cff;
                  color: #000;
                  font-family: 'Roboto', sans-serif;
                  font-size: 16px;
                  font-weight: 600;
                  cursor: pointer;
                  color: white;
                    }
            
                    .last {
                        /* CSS for .last goes here */
                        margin-top: 20px;
                    }
                </style>
            </head>
            
            <body>
                <div class="content">
                    <div class="field">
                        <h1>Reset Password</h1>
                        <p>Hi ${userName},</p>
                        <p>We received a request to reset the password for your Skill-Learn account. If you didn't initiate this request,
                            please ignore this email.</p>
                        <p class="last">To reset your password, click the button above:</p>
                        <a href="http://localhost:3000/newpassword?token=${token}"><button>New Password</button></a>
                    </div>
                </div>
            </body>
            
            </html>
            `,

        };

        return this.transporter.sendMail(mailOptions);
    }

    professionalForgetPassword(userName : string, email : string, token) {
        const mailOptions = {
            from: 'Skill learn <onboarding@resend.dev>',
            to: [email],
            subject: 'New Password',
            html: `<!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Skill-learn</title>
                <style>
                    .content {
                        /* CSS for body goes here */
                        display: flex;
                        width: 100%;
                        height: 100vh;
                        align-items: center;
                        justify-content: center;
                        padding: 10% 0 0 20%;
                        margin: 0;
                        background: #000;
                    }
            
                    .field {
                        /* CSS for .field goes here */
                        background-color: #0000;
                        color: #fff;
                        width: 440px;
                        height: 577.9px;
                        flex-shrink: 0;
                        padding: 20px;
                    }
            
                    h1 {
                        /* CSS for h1 goes here */
                        color: #FFF;
                        font-family: 'Roboto', sans-serif;
                        font-size: 24px;
                        font-style: normal;
                        font-weight: 600;
                        line-height: 40px;
                    }
            
                    a,
                    button {
                        text-decoration: none;
                        border: none;
                        outline: none;
                        color: black;
                    }
            
                    p {
                        /* CSS for p goes here */
                        color: #AAA;
                        font-family: 'Roboto', sans-serif;
                        font-size: 13px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 24px;
                    }
            
                    button {
                        display: inline-block;
                  margin-top: 20px;
                  padding: 16.2px 66.74px 15.6px 66.26px;
                  border-radius: 8px;
                  background: #1f7cff;
                  color: #000;
                  font-family: 'Roboto', sans-serif;
                  font-size: 16px;
                  font-weight: 600;
                  cursor: pointer;
                  color: white;
                    }
            
                    .last {
                        /* CSS for .last goes here */
                        margin-top: 20px;
                    }
                </style>
            </head>
            
            <body>
                <div class="content">
                    <div class="field">
                        <h1>Reset Password</h1>
                        <p>Hi ${userName},</p>
                        <p>We received a request to reset the password for your Skill-Learn account. If you didn't initiate this request,
                            please ignore this email.</p>
                        <p class="last">To reset your password, click the button above:</p>
                        <a href="http://localhost:3000/professional/newpassword?token=${token}"><button>New Password</button></a>
                    </div>
                </div>
            </body>
            
            </html>
            `,

        };

        return this.transporter.sendMail(mailOptions);
    }
}
