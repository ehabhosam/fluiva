import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoutineDto } from './dto/createRoutineDto';
import { CreateMultipleRoutinesDto } from './dto/createMultipleRoutines';
import PlannerRoutine from 'planner/routine';
import { Routine as DBRoutine, PrismaClient } from '@prisma/client';

@Injectable()
export class RoutineService {
  constructor(private prisma: PrismaService) {}

  async createRoutine(
    data: CreateRoutineDto,
    prisma?: PrismaClient,
  ): Promise<DBRoutine> {
    const { planId, repeatedUnits, ...rest } = data;
    const _prisma = prisma || this.prisma;

    return await _prisma.routine.create({
      data: {
        ...rest,
        repeated_units: repeatedUnits,
        plan: {
          connect: {
            id: data.planId,
          },
        },
      },
    });
  }

  async addMultipleRoutines({
    routines,
    planId,
    prisma,
  }: CreateMultipleRoutinesDto) {
    return await Promise.all(
      routines.map(async (routine) => {
        const db_routine = await this.createRoutine(
          {
            ...routine,
            planId,
          },
          prisma,
        );

        return this.formatRoutineToPlannerRoutine(db_routine);
      }),
    );
  }

  formatRoutineToPlannerRoutine(routine: DBRoutine): PlannerRoutine {
    return {
      id: routine.id.toString(),
      title: routine.title,
      repeated_units: routine.repeated_units,
      description: routine.description,
      type: 'routine',
    };
  }
}
