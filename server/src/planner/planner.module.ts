import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlannerService } from './planner.service';
import { PlannerController } from './planner.controller';
import plannerConfig from './planner.config';

@Module({
  imports: [ConfigModule.forFeature(plannerConfig)],
  controllers: [PlannerController],
  providers: [PlannerService],
  exports: [PlannerService],
})
export class PlannerModule {}
