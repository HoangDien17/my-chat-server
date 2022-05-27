import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class ErrorModel {
  @ApiProperty()
  @IsString()
  statusCode: string;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsString()
  timestamp: string;

  @ApiProperty()
  @IsString()
  path: string;
}
