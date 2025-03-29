import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/createCategory.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findDefaultCategories() {
    return await this.prisma.category.findMany({
      where: {
        default: true,
      },
    });
  }

  async findUserCategories(userId: string) {
    return await this.prisma.category.findMany({
      where: {
        OR: [
          {
            user_id: Number(userId),
          },
          {
            default: true,
          },
        ],
      },
    });
  }

  async createCategory(data: CreateCategoryDto, user_id: number) {
    if (!data.name) {
      throw new HttpException('Name is required', 400);
    }

    if (!data.image_url) {
      throw new HttpException('Category Image is required', 400);
    }

    return await this.prisma.category.create({
      data: {
        name: data.name,
        image_url: data.image_url,
        user_id,
      },
    });
  }
}
