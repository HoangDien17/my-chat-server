import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  contactId: string;
}
