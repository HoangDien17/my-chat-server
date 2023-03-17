import { Module, forwardRef } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactRepository } from './repository/contact.repository';
import { Contact, ContactSchema } from './models/contact.model';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactController } from './contact.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Contact.name,
        schema: ContactSchema,
      },
    ]),
    UserModule,
  ],
  providers: [ContactService, ContactRepository],
  controllers: [ContactController],
  exports: [ContactService, ContactRepository],
})
export class ContactModule {}
