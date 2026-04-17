import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : exceptionResponse.message;

    const res: any = {
      code: statusCode,
      status: false,
      message: Array.isArray(message) ? message[0] : message,
      data: null,
    };

    if (process.env.APP_ENV === 'development') {
      res.path = exception.stack;
    }

    response.status(statusCode).json(res);
  }
}
