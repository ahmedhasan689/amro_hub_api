import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { UserQueryDto } from './dto/user-query-dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/get-all-users')
  findAll(@Query() query: UserQueryDto) {
    return this.usersService.findAll(query);
  }

  @Get('/find-user-by-email')
  findByEmailWithPassword(@Body('email') email: string): Promise<User | null> {
    return this.usersService.findByEmailWithPassword(email);
  }

  @Get('/:id')
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOne(id);
  }
}

