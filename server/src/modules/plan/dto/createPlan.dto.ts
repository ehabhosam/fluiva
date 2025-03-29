import { PlanType } from '@prisma/client';

export class CreatePlanDto {
  constructor(
    public title: string,
    public description: string,
    public categoryId: number,
    public ownerId: number,
    public type: PlanType,
  ) {}
}
