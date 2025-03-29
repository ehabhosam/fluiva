import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TaskModule } from '../task/task.module';
import { RoutineModule } from '../routine/routine.module';
import { PeriodModule } from './period/period.module';
import { BlockModule } from '../block/block.module';
import { PeriodController } from './period/period.controller';

@Module({
  controllers: [PlanController, PeriodController],
  providers: [PlanService],
  imports: [PrismaModule, RoutineModule, TaskModule, PeriodModule, BlockModule],
})
export class PlanModule {}
