import { PrismaClient } from '@prisma/client';

export class CreateMultipleRoutinesDto {
  constructor(
    public routines: {
      title: string;
      description: string;
      repeatedUnits: number;
    }[],
    public planId: number,
    public prisma?: PrismaClient,
  ) {}
}
