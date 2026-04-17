import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';
import { AdminService } from '../admin.service';
import { User } from '../../users/user.entity';
import { Admin } from '../admin.entity';
import { AdminLoginDto } from './dto/login.dto';

@Injectable()
export class AuthAdminService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
    private readonly i18n: I18nService,
  ) {}

  async login(loginDto: AdminLoginDto) {
    const { email, password } = loginDto;

    const admin = await this.adminService.findByEmailWithPassword(email);

    if (!admin) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }

    const token = this.generateToken(admin.id, admin.name, admin.email);

    return {
      message: this.i18n.t('messages.auth.login_success'),
      admin: this.sanitizeAdmin(admin),
      access_token: token,
    };
  }

  private generateToken(adminId: string, name: string, email: string): string {
    return this.jwtService.sign({ sub: adminId, name, email, type: 'admin'});
  }

  private sanitizeAdmin(admin: Admin) {
    const { password, ...result } = admin;
    return result;
  }
}