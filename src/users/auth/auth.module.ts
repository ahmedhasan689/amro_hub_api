import { MainAuthModule } from '../../common/auth/auth.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users.module';
import { AuthService } from './auth.service';

@Module({
  imports: [MainAuthModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
