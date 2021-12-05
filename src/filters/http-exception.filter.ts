import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const message = exception.message;
    Logger.log(`${request.method} ${request.url}`, message);

    // 错误码为 1
    const errorResponse = {
      msg: message,
      code: status || 1,
      url: request.url,
    };

    response.status(status).json(errorResponse);
  }
}
