import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const response = http.getResponse();
    const request = http.getRequest();

    return next.handle().pipe(
      map((payload) => {
        console.log(payload);
        const statusCode = response.statusCode;

        const isPaginated =
          payload &&
          typeof payload === 'object' &&
          'data' in payload &&
          'meta' in payload;

        const data = isPaginated ? payload.data : payload;

        let message = '';
        let finalData = data;

        if (data && typeof data === 'object' && 'message' in data) {
          const { message: extractedMessage, ...rest } = data;
          message = extractedMessage;
          finalData = rest;
        } else {
          message = this.getDefaultMessage(request.method);
        }


        const res: any = {
          code: statusCode,
          status: statusCode >= 200 && statusCode < 300,
          message,
          data: finalData,
        };

        if (isPaginated) {
          res.pagination = payload.meta;
        }

        return res;
      }),
    );
  }

  private getDefaultMessage(method: string): string {
    switch (method) {
      case 'POST':
        return 'CREATED_SUCCESSFULLY';
      case 'PATCH':
      case 'PUT':
        return 'UPDATED_SUCCESSFULLY';
      case 'DELETE':
        return 'DELETED_SUCCESSFULLY';
      case 'GET':
      default:
        return 'FETCHED_SUCCESSFULLY';
    }
  }
}
