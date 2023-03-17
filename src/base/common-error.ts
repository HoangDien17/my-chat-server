import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Errors } from './error';

export class InternalServerError extends HttpException {
  constructor() {
    super(Errors.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @ApiProperty({
    type: 'string',
    default: 'Internal Server Error',
  })
  readonly message: string;

  @ApiProperty({
    type: 'HttpStatus',
    default: 500,
  })
  readonly statusCode: HttpStatus;

  @ApiProperty({
    type: 'string',
    default: 'INTERNAL_SERVER_ERROR',
  })
  readonly code: string;

  @ApiProperty({
    type: 'string',
    default: '500',
  })
  readonly errorCode: string;
}
export class BadRequestError extends HttpException {
  constructor() {
    super(Errors.BAD_REQUEST_ERROR, HttpStatus.BAD_REQUEST);
  }

  @ApiProperty({
    type: 'string',
    default: 'Bad request',
  })
  readonly message: string;

  @ApiProperty({
    type: 'HttpStatus',
    default: 400,
  })
  readonly statusCode: HttpStatus;

  @ApiProperty({
    type: 'string',
    default: 'BAD_REQUEST_ERROR',
  })
  readonly code: string;

  @ApiProperty({
    type: 'string',
    default: '400',
  })
  readonly errorCode: string;
}
export class ForbiddenError extends HttpException {
  constructor() {
    super(Errors.FORBIDDEN_ERROR, HttpStatus.FORBIDDEN);
  }

  @ApiProperty({
    type: 'string',
    default: 'Forbidden',
  })
  readonly message: string;

  @ApiProperty({
    type: 'HttpStatus',
    default: 403,
  })
  readonly statusCode: HttpStatus;

  @ApiProperty({
    type: 'string',
    default: 'FORBIDDEN',
  })
  readonly code: string;

  @ApiProperty({
    type: 'string',
    default: '403',
  })
  readonly errorCode: string;
}
export class NotFoundError extends HttpException {
  constructor() {
    super(Errors.NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
  }

  @ApiProperty({
    type: 'string',
    default: 'Not found',
  })
  readonly message: string;

  @ApiProperty({
    type: 'HttpStatus',
    default: 404,
  })
  readonly statusCode: HttpStatus;

  @ApiProperty({
    type: 'string',
    default: 'NOT_FOUND',
  })
  readonly code: string;

  @ApiProperty({
    type: 'string',
    default: '404',
  })
  readonly errorCode: string;
}
export class UnauthorizedError extends HttpException {
  constructor() {
    super(Errors.UNAUTHORIZED_ERROR, HttpStatus.UNAUTHORIZED);
  }
  @ApiProperty({
    type: 'string',
    default: 'Unauthorized',
  })
  readonly message: string;

  @ApiProperty({
    type: 'HttpStatus',
    default: 401,
  })
  readonly statusCode: HttpStatus;

  @ApiProperty({
    type: 'string',
    default: 'UNAUTHORIZED',
  })
  readonly code: string;

  @ApiProperty({
    type: 'string',
    default: '401',
  })
  readonly errorCode: string;
}
