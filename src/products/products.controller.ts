import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import ProductsService from './products.service';
import { ProductQueryDto } from './dto/product-query.dto';
import { multerConfig } from '../common/multer/multer.config';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthTypeGuard } from '../common/guards/auth-type.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from '../common/decorators/auth.decorator';

@Controller('products')
@Auth('admin')
@UseGuards(JwtAuthGuard, AuthTypeGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/get-all-products')
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Post('/create')
  @UseInterceptors(FileInterceptor('coverImage', multerConfig))
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.create(createProductDto, file.filename);
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch('/:id/update')
  @UseInterceptors(FileInterceptor('coverImage', multerConfig))
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.update(id, updateProductDto, file?.filename);
  }

  @Delete('/:id/delete')
  delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }

  @Patch('/:id/change-status')
  changeStatus(@Param('id') id: string) {
    return this.productsService.changeStatus(id);
  }
}
