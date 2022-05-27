import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from './models/user.model';
import { UserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly service: UserService) {}
  @Post('register')
  @ApiBody({
    description: 'User information',
    type: UserDto,
  })
  @ApiOperation({
    operationId: 'registerUser',
    description: 'register user',
  })
  async register(@Body() userDto: UserDto): Promise<User> {
    return this.service.register(userDto);
  }
}
