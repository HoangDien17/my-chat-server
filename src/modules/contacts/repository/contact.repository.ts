/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { BaseRepository } from 'src/base/base.repository';
import { Contact } from '../models/contact.model';

@Injectable()
export class ContactRepository extends BaseRepository<Contact> {
  constructor(@InjectModel(Contact.name) model: Model<Contact>, logger: PinoLogger) {
    super(model, logger);
  } 
}
