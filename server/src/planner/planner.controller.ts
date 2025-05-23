import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PlannerService } from './planner.service';
import { PlannerConnectionError, PlannerServiceError } from './planner.errors';
import { PlanRequest, TimeConstraintsRequest } from './planner.interfaces';

@Controller('planner')
export class PlannerController {
  constructor(private readonly plannerService: PlannerService) {}

  @Post('generate-plan')
  async generatePlan(@Body() planRequest: PlanRequest) {
    try {
      return await this.plannerService.generatePlan(planRequest);
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
      throw error;
    }
  }

  @Post('time-constraints')
  async getTimeConstraints(
    @Body() timeConstraintsRequest: TimeConstraintsRequest,
  ) {
    try {
      return await this.plannerService.getTimeConstraints(
        timeConstraintsRequest,
      );
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
      throw error;
    }
  }
}
