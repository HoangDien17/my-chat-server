import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from './models/user.model';
import { KeyWordDto, UserDto, UserLoginDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('Users')
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

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({
    description: 'User information',
    type: UserLoginDto,
  })
  @ApiOperation({
    operationId: 'loginUser',
    description: 'login user',
  })
  async login(@Body() userLoginDto: UserLoginDto): Promise<User> {
    return this.service.login(userLoginDto);
  }

  @Get('/:currentId')
  @ApiOperation({
    operationId: 'getAllUser',
    description: 'Get All User',
  })
  @ApiQuery({
    name: 'keyWord',
    description: 'Key Word',
    required: false,
    type: String,
  })
  async findAll(
    @Query() keyWord: KeyWordDto,
    @Param('currentId') currentId: string,
  ): Promise<User> {
    return this.service.findAll(keyWord, currentId);
  }
}
