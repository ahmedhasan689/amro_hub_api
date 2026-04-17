import { SetMetadata } from '@nestjs/common';

export const AUTH_TYPE_KEY = 'auth_type';

export const AuthType = (...types: ('admin' | 'user')[]) =>
  SetMetadata(AUTH_TYPE_KEY, types);
