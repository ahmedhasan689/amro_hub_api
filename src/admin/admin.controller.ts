import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { AuthTypeGuard } from '../common/guards/auth-type.guard';
import { AdminQueryDto } from './dto/admin-query.dto';
import { Auth } from '../common/decorators/auth.decorator';
import { GetPrincipal } from '../common/decorators/get-principal.decorator';

@Controller('admins')
@UseGuards(JwtAuthGuard, AuthTypeGuard)
@Auth('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/get-all-admins')
  findAll(@Query() query: AdminQueryDto) {
    return this.adminService.findAll(query);
  }

  @Get('/get-my-profile')
  getMyProfile(@GetPrincipal() admin: any) {
    return  this.adminService.getMyProfile(admin);
  }
}
