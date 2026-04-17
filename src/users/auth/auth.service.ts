import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';
import { UsersService } from '../users.service';
import { User } from '../user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private readonly i18n: I18nService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.findByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }

    const token = this.generateToken(user.id, user.email);

    return {
      message: this.i18n.t('messages.auth.login_success'),
      admin: this.sanitizeUser(user),
      access_token: token,
    };
  }

  private generateToken(adminId: string, email: string): string {
    return this.jwtService.sign({ sub: adminId, email, type: 'user' });
  }

  private sanitizeUser(user: User) {
    const { password, ...result } = user;
    return result;
  }
}
