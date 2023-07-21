import { Controller, Get, Post, Patch, Body, Res } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Response } from 'express';

@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService : AdminService
    ){}

    @Post('login')
    async adminLogin(
        @Body('email') email : string,
        @Body('password') password : string,
        @Res() res : Response
    ){
        try {
            return this.adminService.adminLogin(email, password, res)
        } catch (error) {
            return res.status(404).json({message : 'Email or password is incorrect'})
        }
    }

    @Get('get_users')
    async getUser(@Res() res : Response){
        try {
            return this.adminService.getUsers(res)
        } catch (error) {
            return res.status(500).json({status : 'error', message : 'User fetching failed'})
        }
    }
    
    @Get('get_professionals')
    async getProfessionals(@Res() res : Response){
        try {
            return this.adminService.getProfessionals(res)
        } catch (error) {
            return res.status(500).json({status : 'error', message : 'Professional fetching failed'})
        }
    }

    @Get('professional_requests')
    async getProfessionalRequest(@Res() res : Response){
        try{
            return this.adminService.getRequestedProfessionals(res)
        }catch(error){
            return res.status(500).json({status : 'error', message : 'Requested professional failed'})
        }
    }

    @Patch('blockUser')
    async blockUser(@Body('id') id : string, @Res() res : Response){
        try {
            return this.adminService.blockUser(id, res)
        } catch (error) {
            return res.status(500).json({status : 'error', message : 'User blocking failed'})
        }
    }

    @Patch('unblockUser')
    async unblockUser(@Body('id') id : string, @Res() res : Response){
        try {
            return this.adminService.unblockUser(id, res)
        } catch (error) {
            return res.status(500).json({status : 'error', message : 'User blocking failed'})
        }
    }

    @Patch('approveprofessionals')
    async approveProfessionals(@Body() id : string, @Res() res : Response){
        try {
            return this.adminService.approveProfessionals(id, res)
        } catch (error) {
            return res.status(500).json({message : 'Professional approving failed'})
        }
    }

    @Patch('rejectProfessionals')
    async rejectProfessionals(@Body() id : string, @Res() res : Response){
        try {
            return this.adminService.rejectProfessionals(id, res)
        } catch (error) {
            return res.status(500).json({message : 'Professional rejection failed'})
        }
    }

    @Patch('blockprofessionals')
    async blockProfessionals(@Body() id : string, @Res() res : Response){
        try {
            return this.adminService.blockProfessionals(id, res)
        } catch (error) {
            res.status(500).json({status : 'error', message : 'Professional blocking failed'})
        }
    }

    @Patch('unblockprofessionals')
    async unblockProfessiionals(@Body() id : string, @Res() res : Response){
        try {
            return this.adminService.unblockProfessionals(id, res)
        } catch (error) {
            res.status(500).json({status : 'error', message : 'Professional unblocking failed'})
        }
    }
}
