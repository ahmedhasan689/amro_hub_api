import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_TYPE_KEY } from '../decorators/auth-type.decorator';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthTypeGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private i18n: I18nService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedTypes = this.reflector.getAllAndOverride<('admin' | 'user')[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!allowedTypes) return true;

    const { user } = context.switchToHttp().getRequest();

    console.log(user);

    if (!user || !user.type) {
      throw new ForbiddenException(
        this.i18n.t('messages.auth.wrong_permission'),
      );
    }

    if (!allowedTypes.includes(user.type)) {
      throw new ForbiddenException(
        this.i18n.t('messages.auth.wrong_permission'),
      );
    }

    return true;
  }
}
