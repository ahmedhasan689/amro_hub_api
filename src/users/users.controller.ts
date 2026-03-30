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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/get-all-users')
  @UseGuards(JwtAuthGuard)
  findAll(@Query('email') email: string): Promise<User[] | null> {
    return this.usersService.findAll(email);
  }

  @Get('/find-user-by-email')
  findByEmailWithPassword(@Body('email') email: string): Promise<User | null> {
    return this.usersService.findByEmailWithPassword(email);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOne(id);
  }
}

