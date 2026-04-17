import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { Auth } from '../common/decorators/auth.decorator';

@Controller('sessions')
@Auth('admin')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private readonly sessionService: SessionsService) {}

  @Post('/:clientId/create')
  create(
    @Param('clientId') clientId: string,
    @Body() createSessionDto: CreateSessionDto,
  ) {
    return this.sessionService.create(clientId, createSessionDto);
  }

  @Patch('/:id/check-out')
  checkOut(@Param('id') id: string) {
    return this.sessionService.checkOut(id);
  }
}
