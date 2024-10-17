import { Controller, Get, Post, Patch, Body, Res, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Response } from 'express';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // POST /admin/login
  @Post('login')
  async adminLogin(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    try {
      return this.adminService.adminLogin(email, password, res);
    } catch (error) {
      return res
        .status(404)
        .json({ message: 'Email or password is incorrect' });
    }
  }

  // GET /admin/get_totalusers
  @Get('get_totalusers')
  async getTotalUser(@Res() res: Response) {
    try {
      return this.adminService.getTotalUsers(res);
    } catch (error) {
      return res
        .status(500)
        .json({ status: 'error', message: 'User fetching failed' });
    }
  }

  // GET /admin/get_totalprofessionals
  @Get('get_totalprofessionals')
  async getTotalProfessionals(@Res() res: Response) {
    try {
      return this.adminService.getTotalProfessionals(res);
    } catch (error) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Professional fetching failed' });
    }
  }

  // GET /admin/totalprofessional_requests
  @Get('totalprofessional_requests')
  async getTotalProfessionalRequest(@Res() res: Response) {
    try {
      return this.adminService.getTotalRequestedProfessionals(res);
    } catch (error) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Requested professional failed' });
    }
  }

  // GET /admin/get_users
  @Get('get_users')
  async getUser(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Res() res: Response,
  ) {
    try {
      return this.adminService.getUsers(page, limit, res);
    } catch (error) {
      return res
        .status(500)
        .json({ status: 'error', message: 'User fetching failed' });
    }
  }

  // GET /admin/get_professionals
  @Get('get_professionals')
  async getProfessionals(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Res() res: Response,
  ) {
    try {
      return this.adminService.getProfessionals(page, limit, res);
    } catch (error) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Professional fetching failed' });
    }
  }

  // GET /admin/professional_requests
  @Get('professional_requests')
  async getProfessionalRequest(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Res() res: Response,
  ) {
    try {
      return this.adminService.getRequestedProfessionals(page, limit, res);
    } catch (error) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Requested professional failed' });
    }
  }

  // PATCH /admin/blockUser
  @Patch('blockUser')
  async blockUser(@Body('id') id: string, @Res() res: Response) {
    try {
      return this.adminService.blockUser(id, res);
    } catch (error) {
      return res
        .status(500)
        .json({ status: 'error', message: 'User blocking failed' });
    }
  }

  // PATCH /admin/unblockUser
  @Patch('unblockUser')
  async unblockUser(@Body('id') id: string, @Res() res: Response) {
    try {
      return this.adminService.unblockUser(id, res);
    } catch (error) {
      return res
        .status(500)
        .json({ status: 'error', message: 'User blocking failed' });
    }
  }

  // PATCH /admin/approveprofessionals
  @Patch('approveprofessionals')
  async approveProfessionals(@Body() id: string, @Res() res: Response) {
    try {
      return this.adminService.approveProfessionals(id, res);
    } catch (error) {
      return res.status(500).json({ message: 'Professional approving failed' });
    }
  }

  // PATCH /admin/rejectProfessionals
  @Patch('rejectProfessionals')
  async rejectProfessionals(@Body() id: string, @Res() res: Response) {
    try {
      return this.adminService.rejectProfessionals(id, res);
    } catch (error) {
      return res.status(500).json({ message: 'Professional rejection failed' });
    }
  }

  // PATCH /admin/blockprofessionals
  @Patch('blockprofessionals')
  async blockProfessionals(@Body() id: string, @Res() res: Response) {
    try {
      return this.adminService.blockProfessionals(id, res);
    } catch (error) {
      res
        .status(500)
        .json({ status: 'error', message: 'Professional blocking failed' });
    }
  }

  // PATCH /admin/unblockprofessionals
  @Patch('unblockprofessionals')
  async unblockProfessiionals(@Body() id: string, @Res() res: Response) {
    try {
      return this.adminService.unblockProfessionals(id, res);
    } catch (error) {
      res
        .status(500)
        .json({ status: 'error', message: 'Professional unblocking failed' });
    }
  }
}
