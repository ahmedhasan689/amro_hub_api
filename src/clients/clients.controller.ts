  import {
    Body,
    Controller, Delete,
    Get,
    Param, Patch,
    Post,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
  } from '@nestjs/common';
  import { ClientsService } from './clients.service';
  import { ClientQueryDto } from './dto/client-query.dto';
  import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
  import { CreateClientDto } from './dto/create-client.dto';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { multerConfig } from '../common/multer/multer.config';
  import { UpdateClientDto } from './dto/update-client.dto';
  import { Auth } from '../common/decorators/auth.decorator';
  import { AuthTypeGuard } from '../common/guards/auth-type.guard';

  @Controller('clients')
  @UseGuards(JwtAuthGuard, AuthTypeGuard)
  @Auth('admin')
  export class ClientsController {
    constructor(private readonly clientService: ClientsService) {}

    /**
     * Find All
     * @param query
     */
    @Get('/get-all-clients')
    findAll(@Query() query: ClientQueryDto) {
      return this.clientService.findAll(query);
    }

    /**
     * Create Client
     * @param createClientDto
     * @param file
     */
    @Post('/create')
    @UseInterceptors(FileInterceptor('avatar', multerConfig))
    create(
      @Body() createClientDto: CreateClientDto,
      @UploadedFile() file: Express.Multer.File,
    ) {
      return this.clientService.create(createClientDto, file?.filename);
    }

    @Get('/:id')
    findOne(@Param('id') id: string) {
      return this.clientService.findOne(id);
    }

    @Patch('/:id/update')
    @UseInterceptors(FileInterceptor('avatar', multerConfig))
    update(
      @Param('id') id: string,
      @Body() updateClientDto: UpdateClientDto,
      @UploadedFile() file: Express.Multer.File,
    ) {
      return this.clientService.update(id, updateClientDto, file?.filename);
    }

    @Delete('/:id/delete')
    delete(@Param('id') id: string) {
      return this.clientService.delete(id);
    }
  }
