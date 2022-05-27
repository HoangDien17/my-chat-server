import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserDto {
  @IsOptional()
  userName: string;

  @ApiProperty({ type: String, example: 'Hoang' })
  @MinLength(2)
  @MaxLength(20)
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ type: String, example: 'Hai' })
  @MinLength(2)
  @MaxLength(20)
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ type: String, example: 'hoanghai@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String, example: 'hoHo123' })
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  @IsNotEmpty()
  password: string;
}
export class UserLoginDto {
  @ApiProperty({ type: String, example: 'hoanghai@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String, example: 'hoHo123' })
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  @IsNotEmpty()
  password: string;
}
