import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AccessTokenPayload } from './jwt';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AccessTokenPayload | undefined => {
    const request = context.switchToHttp().getRequest();
    return request.user as AccessTokenPayload | undefined;
  }
);
