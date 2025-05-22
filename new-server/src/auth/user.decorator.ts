import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Parameter decorator to extract the user from the request object
 * Use this decorator in controller methods after applying the AuthGuard
 *
 * @example
 * @UseGuards(AuthGuard)
 * @Get('profile')
 * getProfile(@User() user: any) {
 *   return user;
 * }
 */
export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // If a specific property is requested and it exists on the user object, return just that property
    return data && user ? user[data] : user;
  },
);
