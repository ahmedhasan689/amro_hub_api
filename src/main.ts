import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import methodOverride from 'method-override';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Instance From App

  app.setGlobalPrefix('api'); // /api prefix

  const configService: ConfigService = app.get(ConfigService); // Instance From Config Service
  const port: number | undefined =
    configService.get<number>('APP_PORT') ?? 3000; // APP PORT
  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),

  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(methodOverride('_method'));

  await app.listen(port);
  console.log('🚀 Server running on http://localhost:3000');
}
bootstrap();
