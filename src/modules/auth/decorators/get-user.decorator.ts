import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | string[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new InternalServerErrorException('User not found');

    if (data && Array.isArray(data)) {
      const userData = {};
      for (const key of data) {
        userData[key] = user[key];
      }
      return userData;
    } else if (data && typeof data === 'string') {
      return user[data];
    }
    return user;
  },
);
