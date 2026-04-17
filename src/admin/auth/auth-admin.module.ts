import { MainAuthModule } from '../../common/auth/auth.module';
import { Module } from '@nestjs/common';
import { AuthAdminController } from './auth-admin.controller';
import { AdminModule } from '../admin.module';
import { AuthAdminService } from './auth-admin.service';

@Module({
  imports: [
    MainAuthModule,
    AdminModule,
  ],
  controllers: [AuthAdminController],
  providers: [AuthAdminService],
})
export class AuthAdminModule {}
