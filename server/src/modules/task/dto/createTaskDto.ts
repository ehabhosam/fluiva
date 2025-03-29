import { Priority } from '@prisma/client';

export class CreateTaskDto {
  constructor(
    public title: string,
    public description: string,
    public requiredTime: number,
    public priority: Priority,
    public divisible: boolean,
    public planId: number,
  ) {}
}
