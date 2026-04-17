import { Body, Controller, Post } from '@nestjs/common';
import { AuthAdminService } from './auth-admin.service';
import { AdminLoginDto } from './dto/login.dto';

@Controller('/auth')
export class AuthAdminController {
  constructor(private readonly authAdminService: AuthAdminService) {}

  @Post('/login')
  login(@Body() adminLoginDto: AdminLoginDto) {
    return this.authAdminService.login(adminLoginDto);
  }
}