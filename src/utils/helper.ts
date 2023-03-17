import * as BPromise from 'bluebird';
import * as jsonWebToken from 'jsonwebtoken';
const jwt = BPromise.promisifyAll(jsonWebToken);

export function decodeJWTToken(token: string) {
  return jwt.decode(token);
}

export function isClientErrorStatus(status) {
  return status.toString().match(/^4\d{2}$/);
}
