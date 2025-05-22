import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SUPABASE_JWT_SECRET } from '../config/constants';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'supabase') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: SUPABASE_JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // Verify the JWT has the expected structure from Supabase
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Invalid token structure');
    }

    // Return a user object based on the JWT payload
    return {
      userId: payload.sub,
      email: payload.email,
      // Include other relevant user information from the JWT payload
      aud: payload.aud,
      role: payload.role,
    };
  }
}
