import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { IPayloadToken } from 'src/common/types';

export const PayloadToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest<Request>();
    return request.user as IPayloadToken;
  },
);
