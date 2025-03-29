import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { CreatePlanDataDto } from './dto/createPlanData.dto';
import { PlanService } from './plan.service';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @HttpCode(HttpStatus.OK)
  @Post('generate')
  async generatePlan(@Body() data: CreatePlanDataDto, @Request() req) {
    return await this.planService.generatePlanTransaction(data, req);
  }

  @HttpCode(HttpStatus.OK)
  @Get('')
  async getUserPlans(@Request() req) {
    return await this.planService.getUserPlans(req.user.id);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getPlanById(@Request() req, @Param('id') id: string) {
    return await this.planService.getPlanById(id, req);
  }
}
