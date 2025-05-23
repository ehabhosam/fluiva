import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Type definition for user from Supabase auth
 */
export interface SupabaseUser {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  email: string;
  phone: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    avatar_url: string;
    email: string;
    email_verified: boolean;
    full_name: string;
    iss: string;
    name: string;
    phone_verified: boolean;
    picture: string;
    provider_id: string;
    sub: string;
  };
  role: string;
  aal: string;
  amr: Array<{ method: string; timestamp: number }>;
  session_id: string;
  is_anonymous: boolean;
}

/**
 * Parameter decorator to extract the user from the request object
 * Use this decorator in controller methods after applying the AuthGuard
 *
 * @example
 * @UseGuards(AuthGuard)
 * @Get('profile')
 * getProfile(@User() user: SupabaseUser) {
 *   return user;
 * }
 *
 * // Get a specific property
 * @Get('email')
 * getEmail(@User('email') email: string) {
 *   return email;
 * }
 */
export const User = createParamDecorator(
  <T extends keyof SupabaseUser>(
    data: T | undefined,
    ctx: ExecutionContext,
  ): T extends keyof SupabaseUser ? SupabaseUser[T] : SupabaseUser => {
    const request = ctx.switchToHttp().getRequest();
    const user: SupabaseUser = request.user;

    // If a specific property is requested and it exists on the user object, return just that property
    return data && user ? (user[data] as any) : (user as any);
  },
);
