import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import TableCell from 'planner/tablecell';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class PeriodService {
  constructor(private prisma: PrismaService) {}

  // get the periods of a plan
  async getPeriods(planId: number) {
    return await this.prisma.period.findMany({
      where: {
        plan_id: planId,
      },
    });
  }

  // create periods from a planner table
  async createPeriods(
    plannerTable: TableCell[][],
    planId: number,
    prisma?: PrismaClient,
  ) {
    const _prisma = prisma || this.prisma;

    const periods = await Promise.all(
      plannerTable.map(async (row, index) => {
        const period = await _prisma.period.create({
          data: {
            plan_id: planId,
            index,
          },
        });

        return period;
      }),
    );

    return periods;
  }

  // TODO: reorder periods of a plan
}
