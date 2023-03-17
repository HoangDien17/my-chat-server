import { HttpException, HttpStatus, RequestMethod } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
import { ValidationError } from 'class-validator';
import { EXCLUDED_USER_MIDDLEWARE_ROUTES } from 'src/constants/constant';
import { ErrorKeys, ICError, ICResponseError } from './error.interface';
import { ErrorMessage } from './message.error';

const BASE_ERROR_CODE = '25';
const GENERAL_GROUP_ERROR_CODE = '0';

const getErrorCode = (code, group = GENERAL_GROUP_ERROR_CODE) =>
  `${BASE_ERROR_CODE}${group}${code}`;

function getGeneralErrorCode(code: string) {
  return getErrorCode(code, GENERAL_GROUP_ERROR_CODE);
}

export class BaseException extends HttpException {
  constructor(public baseError: ICError) {
    super(baseError, baseError.statusCode);
  }
}

export const Errors = {
  // General errors
  [ErrorKeys.UNAUTHORIZED_ERROR]: {
    statusCode: HttpStatus.UNAUTHORIZED,
    errorCode: getGeneralErrorCode('000'),
    key: ErrorKeys.UNAUTHORIZED_ERROR,
  },
  [ErrorKeys.BAD_REQUEST_ERROR]: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getGeneralErrorCode('001'),
    key: ErrorKeys.BAD_REQUEST_ERROR,
  },
  [ErrorKeys.FORBIDDEN_ERROR]: {
    statusCode: HttpStatus.FORBIDDEN,
    errorCode: getGeneralErrorCode('002'),
    key: ErrorKeys.FORBIDDEN_ERROR,
  },
  [ErrorKeys.NOT_FOUND_ERROR]: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: getGeneralErrorCode('003'),
    key: ErrorKeys.NOT_FOUND_ERROR,
  },
  [ErrorKeys.INTERNAL_SERVER_ERROR]: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: getGeneralErrorCode('004'),
    key: ErrorKeys.INTERNAL_SERVER_ERROR,
  },
  [ErrorKeys.VALIDATION_ERROR]: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getGeneralErrorCode('005'),
    key: ErrorKeys.BAD_REQUEST_ERROR,
  },

  [ErrorKeys.USER_NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: getGeneralErrorCode('006'),
    key: ErrorKeys.USER_NOT_FOUND,
  },
  [ErrorKeys.PASSWORD_INVALID]: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getGeneralErrorCode('007'),
    key: ErrorKeys.PASSWORD_INVALID,
  },
  [ErrorKeys.CONTACT_ALREADY_EXIST]: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getGeneralErrorCode('008'),
    key: ErrorKeys.CONTACT_ALREADY_EXIST,
  },

  [ErrorKeys.UNKNOWN_ERROR]: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: getGeneralErrorCode('999'),
    key: ErrorKeys.UNKNOWN_ERROR,
  },
};

export function createGeneralExceptionError(
  error: Error,
  req,
): ICResponseError {
  if (error instanceof BaseException) {
    const errorResponse = error.getResponse() as ICError;
    const routeIsExcluded = EXCLUDED_USER_MIDDLEWARE_ROUTES.some(
      (excludedRoute: RouteInfo) => {
        return (
          req.originalUrl === `${excludedRoute.path}` &&
          (excludedRoute.method === RequestMethod[req.method as string] ||
            req.method === RequestMethod.ALL)
        );
      },
    );
    if (!routeIsExcluded) {
      if (!req.headers['access-token']) {
        return {
          message: ErrorMessage['UNAUTHORIZED_ERROR'],
          errorCode: Errors[ErrorKeys.UNAUTHORIZED_ERROR].errorCode,
          code: Errors[ErrorKeys.UNAUTHORIZED_ERROR].key,
          statusCode: Errors[ErrorKeys.UNAUTHORIZED_ERROR].statusCode,
        };
      }
    }
    return {
      message: ErrorMessage[errorResponse.key] || error.message,
      errorCode: errorResponse?.errorCode,
      code: errorResponse.key,
      statusCode: errorResponse.statusCode,
    };
  }

  if (Array.isArray(error) && error.some((e) => e instanceof ValidationError)) {
    const formattedErrors = validationErrorsFormatter(error);
    const message = formattedErrors[Object.keys(formattedErrors)[0]][0];
    return {
      message,
      errorCode: Errors.VALIDATION_ERROR.errorCode,
      code: Errors.VALIDATION_ERROR.key,
      statusCode: Errors.VALIDATION_ERROR.statusCode,
    };
  }

  const { status, message } = getErrorStatusAndMessage(error);
  return {
    errorCode: Errors.UNKNOWN_ERROR.errorCode,
    code: Errors.UNKNOWN_ERROR.key,
    message: message,
    statusCode: status,
  };
}

export const validationErrorsFormatter = (validationErrors) => {
  const messages = {};
  if (validationErrors.length) {
    validationErrors.forEach((item) => {
      const objKeys = Object.keys(item.constraints);
      messages[item.property] = messages[item.property] || [];
      objKeys.forEach((constraint) => {
        messages[item.property].push(item.constraints[constraint]);
      });
    });
  }
  return messages;
};

const getErrorStatusAndMessage = (error: any) => {
  const status =
    error.response?.data?.statusCode ||
    error.response?.status ||
    error.status ||
    Errors.UNKNOWN_ERROR.statusCode;
  const message =
    error.response?.data?.message ||
    error.response?.data ||
    error.message ||
    ErrorMessage[error.baseError.key];
  return { status, message };
};
