import { createParamDecorator } from '@nestjs/common';
import { getUserId } from 'src/middlewares/user.middleware';

export const User = createParamDecorator(() => getUserId());
