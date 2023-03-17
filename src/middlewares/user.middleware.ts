import { Injectable, NestMiddleware, RequestMethod } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
import * as httpContext from 'express-http-context';
import {
  ACCESS_TOKEN_HEADER_NAME,
  EXCLUDED_USER_MIDDLEWARE_ROUTES,
} from 'src/constants/constant';
import { IJwtPayload } from 'src/modules/user/interfaces/user.interface';
import { decodeJWTToken } from 'src/utils/helper';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  async use(req, res, next) {
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
      const user = await this.getUserSession(req);
      if (user) {
        req.user = user;
        httpContext.set('userId', user.id);
      }
    }
    next();
  }

  async getUserSession(req): Promise<IJwtPayload | null> {
    const accessToken = req.get(ACCESS_TOKEN_HEADER_NAME);
    if (!accessToken) {
      return null;
    }
    return decodeJWTToken(accessToken);
  }
}

export function getUserId() {
  return httpContext.get('userId');
}
