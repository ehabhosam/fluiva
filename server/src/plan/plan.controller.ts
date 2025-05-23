import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { GeneratePlanDto } from './dto/generate-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { ReorderPeriodsDto } from './dto/reorder-periods.dto';
import { MoveBlockDto } from './dto/move-block.dto';
import { ReorderBlocksDto } from './dto/reorder-blocks.dto';
import {
  PlannerConnectionError,
  PlannerServiceError,
} from '../planner/planner.errors';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  async getUserPlans(@Request() req) {
    try {
      // Assuming you have a userId from authentication
      const userId = req.user?.sub || req.user?.id;
      return await this.planService.getUserPlans(userId);
    } catch (error) {
      console.error('Error fetching user plans:', error);
      throw new HttpException(
        'Failed to fetch plans',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getPlanById(@Param('id', ParseIntPipe) id: number, @Request() req) {
    try {
      // Assuming you have a userId from authentication
      const userId = req.user?.sub || req.user?.id;
      return await this.planService.getPlanById(id, userId);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      console.error(`Error fetching plan with ID ${id}:`, error);
      throw new HttpException(
        'Failed to fetch plan',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async generatePlan(@Body() generatePlanDto: GeneratePlanDto, @Request() req) {
    try {
      // If using authentication, you might get userId from the request
      if (req.user?.sub || req.user?.id) {
        generatePlanDto.userId = req.user?.sub || req.user?.id;
      }

      return await this.planService.generatePlan(generatePlanDto);
    } catch (error) {
      if (error instanceof PlannerConnectionError) {
        throw new HttpException(
          'Cannot connect to planning service',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      } else if (error instanceof PlannerServiceError) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Handle other errors
      console.error('Error generating plan:', error);
      throw new HttpException(
        'Failed to generate plan',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id')
  async updatePlan(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlanDto: UpdatePlanDto,
    @Request() req,
  ) {
    try {
      // Assuming you have a userId from authentication
      const userId = req.user?.sub || req.user?.id;
      return await this.planService.updatePlan(id, userId, updatePlanDto);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      console.error(`Error updating plan with ID ${id}:`, error);
      throw new HttpException(
        'Failed to update plan',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('reorder-periods')
  async reorderPeriods(
    @Body() reorderPeriodsDto: ReorderPeriodsDto,
    @Request() req,
  ) {
    try {
      // Assuming you have a userId from authentication
      const userId = req.user?.sub || req.user?.id;
      return await this.planService.reorderPeriods(userId, reorderPeriodsDto);
    } catch (error) {
      if (error.status === 404 || error.status === 400) {
        throw error;
      }
      console.error('Error reordering periods:', error);
      throw new HttpException(
        'Failed to reorder periods',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('move-block')
  async moveBlock(@Body() moveBlockDto: MoveBlockDto, @Request() req) {
    try {
      // Assuming you have a userId from authentication
      const userId = req.user?.sub || req.user?.id;
      return await this.planService.moveBlock(userId, moveBlockDto);
    } catch (error) {
      if (error.status === 404 || error.status === 400) {
        throw error;
      }
      console.error('Error moving block:', error);
      throw new HttpException(
        'Failed to move block',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('reorder-blocks')
  async reorderBlocks(
    @Body() reorderBlocksDto: ReorderBlocksDto,
    @Request() req,
  ) {
    try {
      // Assuming you have a userId from authentication
      const userId = req.user?.sub || req.user?.id;
      return await this.planService.reorderBlocks(userId, reorderBlocksDto);
    } catch (error) {
      if (error.status === 404 || error.status === 400) {
        throw error;
      }
      console.error('Error reordering blocks:', error);
      throw new HttpException(
        'Failed to reorder blocks',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
