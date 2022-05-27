/* eslint-disable prettier/prettier */
import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { UserDto, UserLoginDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
const saltRounds = 10;

@Injectable()
export class UserService {
  constructor(
    private readonly repo: UserRepository,
    @InjectPinoLogger(UserService.name)
    private readonly logger: PinoLogger,
  ) {}
  async register(userInfor: UserDto): Promise<any> {
    const userExist = await this.repo.findOne({ email: userInfor.email });
    if (userExist) {
      this.logger.error('User already registered');
      throw new BadRequestException('User already registered');
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const user = {
      ...userInfor,
      userName: userInfor.email.split('@')[0],
      password: bcrypt.hashSync(userInfor.password, salt),
    };
    return this.repo.create(user);
  }

  // async login(userLogin: UserLoginDto): Promise<any> {
  //   const userExist = await this.repo.findOne({email: userLogin.email});
  //   if (!userExist) {
  //     this.logger.error('User not found');
  //     throw new NotFoundException('User not found');
  //   }
  //   const isValid = bcrypt.compareSync(userLogin.password, userExist.password);
  //   if (!isValid) {
  //     this.logger.error('Invalid password');
  //     throw new BadRequestException('Invalid password');
  //   }

  // }
}
