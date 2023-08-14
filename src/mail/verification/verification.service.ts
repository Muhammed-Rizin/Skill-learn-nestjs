import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class VerificationService {
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
    
    userVerifyEmail(userName : string, email : string, token : string) {
        const mailOptions = {
            from: 'Skill learn <onboarding@resend.dev>',
            to: [email],
            subject: 'Email Verification for Your Skill-Learn Account',
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
                        <p>Hello ${userName},</p>
                        <p>We hope this email finds you well. We have received a request to verify the email address associated with 
                        your Skill-Learn account. This verification process is an essential security measure to ensure the ownership 
                        of your account and protect your personal information.</p>

                        <p class="last">If you initiated this verification request, please click on the following link to complete 
                        the email verification process:</p>
                        <a href="https://skilllearn.netlify.app/verifyemail?token=${token}"><button>Verify</button></a>
                        <p class="last">If you didn't initiate this request, please disregard this email. Rest assured, no action is required from you, and your account remains secure.</p>
                        <p>Thank you for being a valued member of Skill-Learn</p>
                        <p>Best regards,</p>
                        <p>The Skill-Learn Team</p>
                    </div>
                </div>
            </body>
            
            </html>
            `,

        };

        return this.transporter.sendMail(mailOptions);
    }

    professionalVerifyEmail(userName : string, email : string, token : string) {
        const mailOptions = {
            from: 'Skill learn <onboarding@resend.dev>',
            to: [email],
            subject: 'Email Verification for Your Skill-Learn Account',
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
                        <p>Hello ${userName},</p>
                        <p>We hope this email finds you well. We have received a request to verify the email address associated with 
                        your Skill-Learn account. This verification process is an essential security measure to ensure the ownership 
                        of your account and protect your personal information.</p>

                        <p class="last">If you initiated this verification request, please click on the following link to complete 
                        the email verification process:</p>
                        <a href="https://skilllearn.netlify.app/professional/verifyemail?token=${token}"><button>Verify</button></a>
                        <p class="last">If you didn't initiate this request, please disregard this email. Rest assured, no action is required from you, and your account remains secure.</p>
                        <p>Thank you for being a valued member of Skill-Learn</p>
                        <p>Best regards,</p>
                        <p>The Skill-Learn Team</p>
                    </div>
                </div>
            </body>
            
            </html>
            `,

        };

        return this.transporter.sendMail(mailOptions);
    }
}
