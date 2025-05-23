import {
  Controller,
  Get,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SupabaseUser, User } from 'src/auth/user.decorator';
import { UpsertUserDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getUserProfile(@User() user: any) {
    return this.userService.getUserProfile(user.userId);
  }

  @Post('upsert')
  async upsertUser(@User() user: SupabaseUser) {
    const dto: UpsertUserDto = {
      id: user.sub,
      email: user.email,
      name: user.user_metadata.full_name,
    };

    try {
      return await this.userService.upsertUser(dto);
    } catch (error) {
      console.error('Error upserting user:', error);
      throw new InternalServerErrorException('Failed to upsert user');
    }
  }
}
