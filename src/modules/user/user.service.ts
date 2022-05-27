/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { UserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
const saltRounds = 10;

@Injectable()
export class UserService {
  constructor(
    private readonly repo: UserRepository,
    @InjectPinoLogger(UserService.name)
    private readonly logger: PinoLogger) {}
  async register(userInfor: UserDto): Promise<any> {
    const userExist = await this.repo.findOne({ email: userInfor.email });
    if (userExist) {
      throw new Error('User already exist');
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const user = {
        ...userInfor,
        userName: userInfor.email.split('@')[0],
        password: bcrypt.hashSync(userInfor.password, salt),
    }
    return this.repo.create(user);
  }
}
