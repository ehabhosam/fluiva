import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SupabaseStrategy } from './supabase.strategy';
import { AuthService } from './auth.service';
import { SUPABASE_JWT_SECRET } from '../config/constants';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'supabase' }),
    JwtModule.register({
      secret: SUPABASE_JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [SupabaseStrategy, AuthService, AuthGuard],
  exports: [AuthService, AuthGuard, JwtModule],
})
export class AuthModule {}
