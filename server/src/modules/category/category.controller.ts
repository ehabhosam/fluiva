import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/createCategory.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('')
  async findUserCategories(@Request() req) {
    const userId = req.user.id;
    return this.categoryService.findUserCategories(userId);
  }

  @Post('')
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.categoryService.createCategory(createCategoryDto, userId);
  }
}
