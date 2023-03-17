import { HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  // General errors
  UNKNOWN_ERROR = '000',
  GENERAL_VALIDATION_EXCEPTION = '002',
  BAD_REQUEST = '400',
  UNAUTHORIZED = '401',
  FORBIDDEN = '403',
  NOT_FOUND = '404',
  INTERNAL_SERVER_ERROR = '500',
}

export interface ICError {
  statusCode: HttpStatus;
  errorCode: string;
  key: ErrorKeys;
}

export interface ICResponseError {
  message: string;
  statusCode: HttpStatus;
  errorCode: string;
  code: ErrorKeys;
}

export enum ErrorKeys {
  // General
  UNAUTHORIZED_ERROR = 'UNAUTHORIZED_ERROR',
  BAD_REQUEST_ERROR = 'BAD_REQUEST_ERROR',
  FORBIDDEN_ERROR = 'FORBIDDEN_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  // User
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  PASSWORD_INVALID = 'PASSWORD_INVALID',

  CONTACT_ALREADY_EXIST = 'CONTACT_ALREADY_EXIST',
}
