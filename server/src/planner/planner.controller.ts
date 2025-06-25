import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PlannerService } from './planner.service';
import { PlannerConnectionError, PlannerServiceError } from './planner.errors';
import { TimeConstraintsRequest } from './planner.interfaces';
import { Public } from 'src/auth/public.decorator';

@Controller('planner')
export class PlannerController {
  constructor(private readonly plannerService: PlannerService) {}

  // @Post('generate-plan')
  // async generatePlan(@Body() planRequest: PlanRequest) {
  //   try {
  //     return await this.plannerService.generatePlan(planRequest);
  //   } catch (error) {
  //     if (error instanceof PlannerConnectionError) {
  //       throw new HttpException(
  //         'Cannot connect to planning service',
  //         HttpStatus.SERVICE_UNAVAILABLE,
  //       );
  //     } else if (error instanceof PlannerServiceError) {
  //       throw new HttpException(
  //         error.message,
  //         HttpStatus.INTERNAL_SERVER_ERROR,
  //       );
  //     }
  //     throw error;
  //   }
  // }

  @Public()
  @Post('time-constraints')
  async getTimeConstraints(
    @Body() timeConstraintsRequest: TimeConstraintsRequest,
  ) {
    try {
      console.log(timeConstraintsRequest);
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
