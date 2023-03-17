import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { CreateContactDto } from './contact.dto';
import { ContactService } from './contact.service';
import { IContact } from './interfaces/contact.interface';

@Controller('contacts')
@ApiTags('Contacts')
export class ContactController {
  constructor(private readonly service: ContactService) {}
  @Post(':contactId')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiOperation({
    operationId: 'createContact',
    description: 'Add friend',
  })
  async createContact(
    @Param('contactId') contactId: string,
    @User() userId: string,
  ): Promise<IContact> {
    return this.service.createContact({ userId, contactId });
  }

  @Get()
  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @ApiOperation({
    operationId: 'getContact',
    description: 'Get list friend',
  })
  async getListContact(@User() userId: string): Promise<IContact[]> {
    return this.service.getListContact(userId);
  }
}
