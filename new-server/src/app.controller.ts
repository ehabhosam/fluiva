import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './auth/user.decorator';
import { Public } from './auth/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // This route is public (not protected)
  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // This route is protected and requires authentication (by global guard)
  @Get('protected')
  getProtected(@User() user: any): any {
    return {
      message: 'This is a protected route',
      user: {
        id: user.id,
        email: user.email,
        // Don't expose sensitive information
      },
    };
  }

  // Another protected route to demonstrate using specific user fields
  @Get('profile')
  getProfile(@User('email') email: string): any {
    return {
      message: `Profile for ${email}`,
      timestamp: new Date().toISOString(),
    };
  }
}
