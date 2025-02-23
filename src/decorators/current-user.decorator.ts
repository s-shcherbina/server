import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (key: keyof User, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    return key ? req.user[key] : req.user;
  },
);
