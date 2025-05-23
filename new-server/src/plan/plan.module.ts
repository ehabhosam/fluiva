import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PlannerModule } from '../planner/planner.module';

@Module({
  imports: [PrismaModule, PlannerModule],
  controllers: [PlanController],
  providers: [PlanService],
  exports: [PlanService],
})
export class PlanModule {}
