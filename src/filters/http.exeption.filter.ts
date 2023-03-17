import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { BaseException, createGeneralExceptionError } from 'src/base/error';

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
  catch(err: Error | HttpException | BaseException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const request = host.switchToHttp().getRequest();
    const responseError = createGeneralExceptionError(err, request);
    response.status(responseError.statusCode).json(responseError);
  }
}
