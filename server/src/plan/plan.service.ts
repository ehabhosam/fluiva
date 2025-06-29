import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PlannerService } from '../planner/planner.service';
import { GeneratePlanDto, TaskDto, RoutineDto } from './dto/generate-plan.dto';
import { TodoType, Priority } from '../../generated/prisma';
import { PlanRequest, Task, Routine } from '../planner/planner.interfaces';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { ReorderPeriodsDto } from './dto/reorder-periods.dto';
import { MoveBlockDto } from './dto/move-block.dto';
import { ReorderBlocksDto } from './dto/reorder-blocks.dto';
import { CompleteBlockDto } from './dto/complete-block.dto';

@Injectable()
export class PlanService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly plannerService: PlannerService,
  ) {}

  async getUserPlans(userId: string) {
    // Get all active plans for a user with a summary view
    const plans = await this.prisma.plan.findMany({
      where: {
        user_id: userId,
        deleted_at: null,
      },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        created_at: true,
        _count: {
          select: {
            todos: true,
            periods: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return plans;
  }

  async getPlanById(planId: number, userId: string) {
    const plan = await this.prisma.plan.findUnique({
      where: {
        id: planId,
      },
      include: {
        todos: true,
        periods: {
          orderBy: {
            index: 'asc',
          },
          include: {
            blocks: {
              orderBy: {
                index: 'asc',
              },
              include: {
                todo: true,
              },
            },
          },
        },
      },
    });

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${planId} not found`);
    }

    // Check ownership
    if (plan.user_id !== userId) {
      throw new NotFoundException(`Plan with ID ${planId} not found`);
    }

    return plan;
  }

  async updatePlan(
    planId: number,
    userId: string,
    updatePlanDto: UpdatePlanDto,
  ) {
    // First check if the plan exists and belongs to the user
    const plan = await this.prisma.plan.findUnique({
      where: {
        id: planId,
      },
    });

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${planId} not found`);
    }

    if (plan.user_id !== userId) {
      throw new NotFoundException(`Plan with ID ${planId} not found`);
    }

    // Update the plan
    return this.prisma.plan.update({
      where: {
        id: planId,
      },
      data: {
        ...(updatePlanDto.title && { title: updatePlanDto.title }),
        ...(updatePlanDto.description !== undefined && {
          description: updatePlanDto.description,
        }),
        ...(updatePlanDto.type && { type: updatePlanDto.type }),
      },
    });
  }

  async reorderPeriods(userId: string, dto: ReorderPeriodsDto) {
    // Start a transaction to ensure atomicity
    return this.prisma.$transaction(async (tx) => {
      // Extract period IDs to fetch them in one query
      const periodIds = dto.periods.map((p) => p.periodId);

      // Fetch all periods to verify they exist and belong to the same plan owned by the user
      const periods = await tx.period.findMany({
        where: {
          id: { in: periodIds },
        },
        include: {
          plan: {
            select: {
              user_id: true,
            },
          },
        },
      });

      if (periods.length !== periodIds.length) {
        throw new NotFoundException('One or more periods not found');
      }

      // Check all periods belong to the same plan
      const planId = periods[0].plan_id;
      const allFromSamePlan = periods.every((p) => p.plan_id === planId);

      if (!allFromSamePlan) {
        throw new BadRequestException(
          'All periods must belong to the same plan',
        );
      }

      // Check user owns the plan
      if (periods[0].plan.user_id !== userId) {
        throw new NotFoundException('Plan not found');
      }

      // Update each period's index
      const updates = dto.periods.map((item) =>
        tx.period.update({
          where: { id: item.periodId },
          data: { index: item.newIndex },
        }),
      );

      return Promise.all(updates);
    });
  }

  async moveBlock(userId: string, dto: MoveBlockDto) {
    return this.prisma.$transaction(async (tx) => {
      // Get the block and validate it exists
      const block = await tx.block.findUnique({
        where: { id: dto.blockId },
        include: {
          period: {
            include: {
              plan: {
                select: {
                  user_id: true,
                  id: true,
                },
              },
            },
          },
        },
      });

      if (!block) {
        throw new NotFoundException(`Block with ID ${dto.blockId} not found`);
      }

      // Check user owns the plan
      if (block.period.plan.user_id !== userId) {
        throw new NotFoundException(`Block with ID ${dto.blockId} not found`);
      }

      // Verify target period exists and belongs to the same plan
      const targetPeriod = await tx.period.findUnique({
        where: { id: dto.targetPeriodId },
        include: {
          plan: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!targetPeriod) {
        throw new NotFoundException(
          `Target period with ID ${dto.targetPeriodId} not found`,
        );
      }

      if (targetPeriod.plan.id !== block.period.plan.id) {
        throw new BadRequestException(
          'Target period must belong to the same plan',
        );
      }

      // Shift blocks in the target period to make space for the new block
      await tx.block.updateMany({
        where: {
          period_id: dto.targetPeriodId,
          index: {
            gte: dto.targetIndex,
          },
        },
        data: {
          index: {
            increment: 1,
          },
        },
      });

      // If moving from the same period but to an earlier position, we need to adjust the target index
      // to account for the shifting that will happen when the block is removed
      let adjustedTargetIndex = dto.targetIndex;
      if (
        block.period_id === dto.targetPeriodId &&
        block.index < dto.targetIndex
      ) {
        adjustedTargetIndex -= 1;
      }

      // Now move the block to the target period and index
      const updatedBlock = await tx.block.update({
        where: { id: dto.blockId },
        data: {
          period_id: dto.targetPeriodId,
          index: adjustedTargetIndex,
        },
        include: {
          todo: true,
        },
      });

      // Close gaps in the source period
      if (block.period_id !== dto.targetPeriodId) {
        await tx.block.updateMany({
          where: {
            period_id: block.period_id,
            index: {
              gt: block.index,
            },
          },
          data: {
            index: {
              decrement: 1,
            },
          },
        });
      }

      return updatedBlock;
    });
  }

  async reorderBlocks(userId: string, dto: ReorderBlocksDto) {
    return this.prisma.$transaction(async (tx) => {
      // Verify the period exists and is owned by the user
      const period = await tx.period.findUnique({
        where: { id: dto.periodId },
        include: {
          plan: {
            select: {
              user_id: true,
            },
          },
        },
      });

      if (!period) {
        throw new NotFoundException(`Period with ID ${dto.periodId} not found`);
      }

      if (period.plan.user_id !== userId) {
        throw new NotFoundException(`Period with ID ${dto.periodId} not found`);
      }

      // Extract block IDs to fetch them in one query
      const blockIds = dto.blocks.map((b) => b.blockId);

      // Verify all blocks exist and belong to the same period
      const blocks = await tx.block.findMany({
        where: {
          id: { in: blockIds },
        },
      });

      if (blocks.length !== blockIds.length) {
        throw new NotFoundException('One or more blocks not found');
      }

      const allFromSamePeriod = blocks.every(
        (b) => b.period_id === dto.periodId,
      );
      if (!allFromSamePeriod) {
        throw new BadRequestException(
          'All blocks must belong to the specified period',
        );
      }

      // Update each block's index
      const updates = dto.blocks.map((item) =>
        tx.block.update({
          where: { id: item.blockId },
          data: { index: item.newIndex },
        }),
      );

      return Promise.all(updates);
    });
  }

  async generatePlan(dto: GeneratePlanDto) {
    // Using Prisma transaction to ensure atomicity
    return this.prisma.$transaction(async (tx) => {
      // 1. Create the plan
      const plan = await tx.plan.create({
        data: {
          title: dto.title,
          description: dto.description || '',
          type: dto.type,
          user: {
            connect: { id: dto.userId },
          },
        },
      });

      console.log('created plan', plan);

      // 2. Create todos (tasks and routines)
      const createdTasks = await this.createTasks(tx, plan.id, dto.tasks);
      const createdRoutines = await this.createRoutines(
        tx,
        plan.id,
        dto.routines,
      );

      // 3. Prepare request for planner microservice
      const plannerRequest = this.preparePlannerRequest(
        dto,
        createdTasks,
        createdRoutines,
      );

      console.log(plannerRequest);

      // 4. Call the planner microservice to generate the plan
      const plannerResponse =
        await this.plannerService.generatePlan(plannerRequest);

      console.log('planner response', plannerResponse);

      // 5. Create periods and blocks based on the response
      await this.createPeriodsAndBlocks(tx, plan.id, plannerResponse.periods);

      // 6. Return the complete plan with all related entities
      return {
        plan: await tx.plan.findUnique({
          where: { id: plan.id },
          include: {
            todos: true,
            periods: {
              include: {
                blocks: {
                  include: {
                    todo: true,
                  },
                },
              },
            },
          },
        }),
        totalTime: plannerResponse.total_time,
      };
    });
  }

  private async createTasks(tx: any, planId: number, tasks: TaskDto[]) {
    const createdTasks = [];

    for (const task of tasks) {
      const createdTask = await tx.todo.create({
        data: {
          title: task.title,
          description: task.description || '',
          required_time: task.requiredTime,
          priority: task.priority || Priority.NORMAL,
          is_breakable: task.isBreakable ?? true,
          type: TodoType.TASK,
          plan: {
            connect: { id: planId },
          },
        },
      });
      createdTasks.push(createdTask);
    }

    return createdTasks;
  }

  private async createRoutines(
    tx: any,
    planId: number,
    routines: RoutineDto[],
  ) {
    const createdRoutines = [];

    for (const routine of routines) {
      const createdRoutine = await tx.todo.create({
        data: {
          title: routine.title,
          description: routine.description || '',
          required_time: routine.requiredTime,
          is_breakable: false, // Routines are typically not breakable
          type: TodoType.ROUTINE,
          plan: {
            connect: { id: planId },
          },
        },
      });
      createdRoutines.push(createdRoutine);
    }

    return createdRoutines;
  }

  private preparePlannerRequest(
    dto: GeneratePlanDto,
    tasks: any[],
    routines: any[],
  ): PlanRequest {
    // Map database tasks to planner service task format
    const mappedTasks: Task[] = tasks.map((task) => ({
      todo: {
        id: String(task.id),
        title: task.title,
        description: task.description,
        required_time: task.required_time,
        type: 'TASK',
      },
      priority: this.mapPriorityToNumber(task.priority),
      is_breakable: task.is_breakable,
    }));

    // Map database routines to planner service routine format
    const mappedRoutines: Routine[] = routines.map((routine) => ({
      todo: {
        id: String(routine.id),
        title: routine.title,
        description: routine.description,
        required_time: routine.required_time,
        type: 'ROUTINE',
      },
    }));

    return {
      build_unit: dto.buildUnit,
      period_unit: dto.periodUnit,
      tasks: mappedTasks,
      routines: mappedRoutines,
      n_periods: dto.nPeriods,
      n_blocks: dto.nBlocks,
    };
  }

  private mapPriorityToNumber(priority: Priority | null | undefined): number {
    switch (priority) {
      case Priority.HIGH:
        console.log('high priority', 3);
        return 3;
      case Priority.NORMAL:
        console.log('normal priority', 2);
        return 2;
      case Priority.LOW:
        console.log('low priority', 1);
        return 1;
      default:
        return 2; // Default to normal priority
    }
  }

  async completeBlock(userId: string, dto: CompleteBlockDto) {
    return this.prisma.$transaction(async (tx) => {
      // Get the block and validate it exists
      const block = await tx.block.findUnique({
        where: { id: dto.blockId },
        include: {
          period: {
            include: {
              plan: {
                select: {
                  user_id: true,
                },
              },
            },
          },
          todo: true,
        },
      });

      if (!block) {
        throw new NotFoundException(`Block with ID ${dto.blockId} not found`);
      }

      // Check user owns the plan
      if (block.period.plan.user_id !== userId) {
        throw new NotFoundException(`Block with ID ${dto.blockId} not found`);
      }

      // Update the block's completion status
      const updatedBlock = await tx.block.update({
        where: { id: dto.blockId },
        data: {
          done_at: dto.completed ? new Date() : null,
        },
        include: {
          todo: true,
        },
      });

      return updatedBlock;
    });
  }

  private async createPeriodsAndBlocks(
    tx: any,
    planId: number,
    generatedPeriods: any[],
  ) {
    // 1. Create all periods at once
    const periodsToCreate = generatedPeriods.map((_, index) => ({
      index,
      plan_id: planId,
    }));

    await tx.period.createMany({
      data: periodsToCreate,
      skipDuplicates: false,
    });

    // Fetch all the created periods to get their IDs
    const periods = await tx.period.findMany({
      where: { plan_id: planId },
      orderBy: { index: 'asc' },
    });

    // 2. Collect all blocks to create
    const blocksToCreate = [];

    for (
      let periodIndex = 0;
      periodIndex < generatedPeriods.length;
      periodIndex++
    ) {
      const periodData = generatedPeriods[periodIndex];
      const periodId = periods[periodIndex].id;

      for (
        let blockIndex = 0;
        blockIndex < periodData.cells.length;
        blockIndex++
      ) {
        const cell = periodData.cells[blockIndex];

        if (cell.todo_id) {
          const todoId = parseInt(cell.todo_id, 10);
          blocksToCreate.push({
            index: blockIndex,
            period_id: periodId,
            todo_id: todoId,
          });
        }
      }
    }

    // Create all blocks at once
    if (blocksToCreate.length > 0) {
      await tx.block.createMany({
        data: blocksToCreate,
        skipDuplicates: false,
      });
    }

    // Return the created structure
    return await tx.period.findMany({
      where: { plan_id: planId },
      include: {
        blocks: {
          orderBy: { index: 'asc' },
        },
      },
      orderBy: { index: 'asc' },
    });
  }
}
