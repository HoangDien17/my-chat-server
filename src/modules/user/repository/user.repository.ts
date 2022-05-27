/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { BaseRepository } from 'src/base/base.repository';
import { User } from '../models/user.model';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(@InjectModel(User.name) model: Model<User>, logger: PinoLogger) {
    super(model, logger);
  } 
}
