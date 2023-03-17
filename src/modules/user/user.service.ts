/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { KeyWordDto, UserDto, UserLoginDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from './interfaces/auth.interface';
import { BaseException, Errors } from 'src/base/error';
const saltRounds = 10;

@Injectable()
export class UserService {
  constructor(
    private readonly repo: UserRepository,
    private readonly jwtService: JwtService,
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

  async login(userLogin: UserLoginDto): Promise<any> {
    const userExist = await this.repo.findOne({ email: userLogin.email });
    if (!userExist) {
      this.logger.error('User not found');
      throw new BaseException(Errors.USER_NOT_FOUND);
    }
    const isValid = bcrypt.compareSync(userLogin.password, userExist.password);
    if (!isValid) {
      this.logger.error('Invalid password');
      throw new BaseException(Errors.PASSWORD_INVALID);
    }
    const payload: AuthPayload = {
      userName: userExist.userName,
      email: userExist.email,
      id: userExist._id,
    };
    return {
      access_token: this.jwtService.sign(payload),
      userId: userExist._id,
    };
  }

  async checkExistUser(userId: string): Promise<boolean> {
    const userExist = await this.repo.findById(userId);
    if (!userExist) {
      this.logger.error('User not found');
      throw new BaseException(Errors.USER_NOT_FOUND);
    }
    return true;
  }

  async findAll(keyWordDto: KeyWordDto, currentId: string): Promise<any> {
    return this.repo.findByKeyword(keyWordDto.keyWord, currentId);
  }
}
