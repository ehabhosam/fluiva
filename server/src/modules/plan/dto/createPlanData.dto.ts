import { PlanType } from '@prisma/client';
import { CreateRoutineDto } from 'src/modules/routine/dto/createRoutineDto';
import { CreateTaskDto } from 'src/modules/task/dto/createTaskDto';

export class CreatePlanDataDto {
  constructor(
    public title: string,
    public description: string,
    public categoryId: number,
    public tasks: Exclude<CreateTaskDto, 'planId'>[],
    public routines: Exclude<CreateRoutineDto, 'planId'>[],
    public numberOfBlocks: number,
    public numberOfPeriods: number,
    public type: PlanType,
  ) {}
}
