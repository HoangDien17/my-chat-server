import { RequestMethod } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';

export const EXCLUDED_USER_MIDDLEWARE_ROUTES: RouteInfo[] = [
  { path: '/user/register', method: RequestMethod.POST },
  { path: '/user/login', method: RequestMethod.POST },
];

export const ACCESS_TOKEN_HEADER_NAME = 'access-token';
