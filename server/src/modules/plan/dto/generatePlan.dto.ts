import { Unit } from 'planner';
import Routine from 'planner/routine';
import Task from 'planner/task';

export class GeneratePlannerDto {
  constructor(
    public plan_title: string,
    public tasks: Task[],
    public routines: Routine[],
    public build_unit: Unit,
    public period_unit: Unit,
    public n_periods: number,
    public n_blocks: number,
  ) {}
}
