import { Priority, PrismaClient } from '@prisma/client';

export class CreateMultipleTasksDto {
  constructor(
    public tasks: {
      title: string;
      description: string;
      requiredTime: number;
      priority: Priority;
      divisible: boolean;
    }[],
    public planId: number,
    // add optional prisma client
    public prisma?: PrismaClient,
  ) {}
}
