import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { BaseException, Errors } from 'src/base/error';
import { UserService } from '../user/user.service';
import { IContact } from './interfaces/contact.interface';
import { ContactRepository } from './repository/contact.repository';

@Injectable()
export class ContactService {
  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly userService: UserService,
    @InjectPinoLogger(ContactService.name) private logger: PinoLogger,
  ) {}

  async createContact(input): Promise<IContact> {
    const { userId, contactId } = input;
    await Promise.all([
      this.userService.checkExistUser(userId),
      this.userService.checkExistUser(contactId),
    ]);
    const checkContact = await this.contactRepository.findOne({
      userId,
      contactId,
    });
    if (checkContact) {
      throw new BaseException(Errors.CONTACT_ALREADY_EXIST);
    }
    this.logger.info(
      `Add contact... userid: ${userId} and contactid: ${contactId}`,
    );
    return this.contactRepository.create(input);
  }

  async getListContact(userId: string): Promise<IContact[]> {
    await this.userService.checkExistUser(userId);
    return this.contactRepository.find({
      userId,
    });
  }
}
