import { Injectable } from '@nestjs/common';
import { UpsertUserDto } from './user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async upsertUser(dto: UpsertUserDto) {
    return this.prisma.user.upsert({
      where: {
        id: dto.id,
      },
      create: {
        id: dto.id,
        email: dto.email,
        full_name: dto.name,
      },
      update: {
        full_name: dto.name,
      },
    });
  }
}
