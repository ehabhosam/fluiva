import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
import { IS_PUBLIC_KEY } from './public.decorator';
import { Request } from 'express';
import { SUPABASE_JWT_SECRET } from '../config/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Get the request object
    const request = context.switchToHttp().getRequest();

    // Extract the token from the Authorization header
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Missing authorization token');
    }

    // Verify the token
    return this.validateToken(token, request);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async validateToken(token: string, request: any): Promise<boolean> {
    try {
      // First try to verify using JwtService
      const payload = await this.jwtService.verifyAsync(token, {
        secret: SUPABASE_JWT_SECRET,
      });

      request.user = payload;
      return true;
    } catch (jwtError) {
      console.log(jwtError);
      try {
        // If JwtService fails, try to verify using Supabase client
        const user = await this.authService.verifyToken(token);

        if (!user) {
          throw new UnauthorizedException('Invalid or expired token');
        }

        // Attach the user to the request object
        request.user = user;
        return true;
      } catch (error) {
        console.error('Token verification error:', error);
        throw new UnauthorizedException('Invalid or expired token');
      }
    }
  }
}
