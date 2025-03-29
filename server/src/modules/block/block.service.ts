import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import TableCell from 'planner/tablecell';
import { Period, PrismaClient } from '@prisma/client';

@Injectable()
export class BlockService {
  constructor(private prisma: PrismaService) {}

  // get blocks of a period
  async getBlocks(periodId: number, req) {
    // get the plan id of the period
    const period = await this.prisma.period.findUnique({
      where: {
        id: periodId,
      },
      include: {
        plan: true,
      },
    });

    if (!period) {
      return {
        error: 'Period not found',
      };
    }

    // get the plan of the period
    const plan = await this.prisma.plan.findUnique({
      where: {
        id: period.plan_id,
      },
      include: {
        tasks: true,
        routines: true,
      },
    });

    // check if the user is the owner of the plan
    if (plan.owner_id !== req.user.id) {
      return {
        error: 'Not authorized',
      };
    }

    const blocks = await this.prisma.block.findMany({
      where: {
        period_id: periodId,
      },
    });

    return blocks.map((block) => {
      // get the title of the block using task_id or routine_id
      let title;
      if (block.task_id) {
        title = plan.tasks.find((task) => task.id === block.task_id).title;
      } else {
        title = plan.routines.find(
          (routine) => routine.id === block.routine_id,
        ).title;
      }
      return {
        ...block,
        title,
      };
    });
  }

  // create blocks from a planner table, and associated periods
  async createBlocks(
    plannerTable: TableCell[][],
    periods: Period[],
    prisma?: PrismaClient,
  ) {
    const _prisma = prisma || this.prisma;

    try {
      await Promise.all(
        plannerTable.map(async (row, rowIndex) => {
          await Promise.all(
            row.map(async (cell, columnIndex) => {
              const periodId = periods[rowIndex].id;
              const data = {
                period_id: periodId,
                order: columnIndex,
              };
              if (cell.type === 'task') {
                data['task_id'] = Number(cell.todo_id);
              } else {
                data['routine_id'] = Number(cell.todo_id);
              }
              await _prisma.block.create({
                data,
              });
            }),
          );
        }),
      );
    } catch (error) {
      throw new Error(error);
    }
  }
}
