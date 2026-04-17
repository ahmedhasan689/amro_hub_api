import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthTypeGuard } from '../guards/auth-type.guard';
import { AuthType } from './auth-type.decorator';

export const Auth = (...types: ('admin' | 'user')[]) =>
  applyDecorators(AuthType(...types), UseGuards(JwtAuthGuard, AuthTypeGuard));
