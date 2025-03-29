import { HttpException, HttpStatus, Injectable, Request } from '@nestjs/common';
import { PlanType, PrismaClient } from '@prisma/client';
import Planner, { Unit } from 'planner';
import { BlockService } from '../block/block.service';
import { PrismaService } from '../prisma/prisma.service';
import { RoutineService } from '../routine/routine.service';
import { TaskService } from '../task/task.service';
import { CreatePlanDto } from './dto/createPlan.dto';
import { CreatePlanDataDto } from './dto/createPlanData.dto';
import { PeriodService } from './period/period.service';

@Injectable()
export class PlanService {
  constructor(
    private prisma: PrismaService,
    private taskService: TaskService,
    private routineService: RoutineService,
    private periodService: PeriodService,
    private blockService: BlockService,
  ) {}

  async getUserPlans(userId: string) {
    try {
      // TODO: fetch the tasks and routines count without fetching the tasks and routines
      const plans = await this.prisma.plan.findMany({
        where: {
          owner_id: Number(userId),
        },
        include: {
          tasks: true,
          routines: true,
          category: true,
        },
      });

      const plansWithCount = plans.map((plan) => {
        const { tasks, routines, ...rest } = plan;
        return {
          ...rest,
          numberOfTasks: tasks.length,
          numberOfRoutines: routines.length,
        };
      });
      return plansWithCount;
    } catch (error) {
      throw new HttpException(
        'An error occurred while fetching your plans',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getPlanById(planId: string, @Request() req) {
    try {
      const plan = await this.prisma.plan.findUnique({
        where: {
          id: Number(planId),
        },
        include: {
          periods: true,
          category: true,
        },
      });

      if (!plan) {
        return new HttpException('Plan not found', HttpStatus.NOT_FOUND);
      }

      // authorize if the user is the owner of the plan
      if (plan.owner_id !== req.user.id) {
        return new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
      }

      return plan;
    } catch (error) {
      throw new HttpException(
        'An error occurred while fetching your plan',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async generatePlanTransaction(data: CreatePlanDataDto, req) {
    /**
      Create the Plan: Begin by creating the plan entity in the database with all the required details.

      Add Tasks and Routines: Once the plan is created, add the tasks and routines associated with it. You can either add them concurrently or sequentially, depending on your application's requirements.

      Create Time Constraints: Determine the time constraints for creating periods and blocks based on your frontend requirements. These constraints could include factors such as the duration of each period, the total duration of the plan, or any specific scheduling rules.

      Generate Periods: Based on the time constraints, generate the periods for the plan. This could involve dividing the total duration of the plan into equal time intervals or applying custom scheduling logic as needed.

      Populate Blocks: For each period, populate the blocks with tasks and routines. Ensure that the blocks are correctly associated with the respective tasks and routines, and consider any constraints or dependencies between them.
    */
    const user = req.user;

    if (this.validatePlanDto(data) !== true) {
      throw new HttpException('Invalid Plan Data', HttpStatus.BAD_REQUEST);
    }

    try {
      var response;
      await this.prisma.$transaction(async (prisma: PrismaClient) => {
        const plan = await this.createPlan(
          {
            title: data.title,
            description: data.description,
            categoryId: data.categoryId,
            ownerId: user.id,
            type: data.type,
          },
          prisma,
        );

        console.log('plan created', plan);

        const tasks = await this.taskService.addMultipleTasks({
          tasks: data.tasks,
          planId: plan.id,
          prisma,
        });

        console.log('tasks created');

        const routines = await this.routineService.addMultipleRoutines({
          routines: data.routines,
          planId: plan.id,
          prisma,
        });

        console.log('routines created');

        const planner = this.generatePlanner(data, tasks, routines);

        const table = planner.generateTable();

        console.log('table generated successfully');

        const periods = await this.periodService.createPeriods(
          table,
          plan.id,
          prisma,
        );

        console.log('periods created successfully');

        await this.blockService.createBlocks(table, periods, prisma);

        console.log('blocks created successfully');

        response = {
          message: 'Plan generated successfully',
          planId: plan.id,
        };
      });

      return response;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'An Error occurred while creating your plan, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createPlan(data: CreatePlanDto, prisma?: PrismaClient) {
    const _prisma = prisma || this.prisma;

    return await _prisma.plan.create({
      data: {
        title: data.title,
        description: data.description,
        category_id: data.categoryId,
        owner_id: data.ownerId,
        type: data.type,
      },
    });
  }

  generatePlanner(data: CreatePlanDataDto, tasks, routines) {
    const { build_unit, period_unit } = this.getUnitsFromPlanType(data.type);

    const planner = new Planner(
      data.title,
      tasks,
      routines,
      build_unit,
      period_unit,
      data.numberOfPeriods,
      data.numberOfBlocks,
    );

    return planner;
  }

  validatePlanDto(data: CreatePlanDataDto) {
    // validate the data
    try {
      if (!data.title || data.description === '') {
        return {
          error: 'Title and description are required',
        };
      }

      if (data.tasks.length === 0 && data.routines.length === 0) {
        return {
          error: 'At least one task or routine is required',
        };
      }
    } catch (error) {
      return {
        error: 'Invalid Plan Data',
      };
    }
    return true;
  }

  getUnitsFromPlanType(type: PlanType): {
    build_unit: Unit;
    period_unit: Unit;
  } {
    switch (type) {
      case PlanType.SWIFT:
        return { build_unit: 'hour', period_unit: 'day' };
      case PlanType.STANDARD:
        return { build_unit: 'day', period_unit: 'week' };
      case PlanType.STRATEGIC:
        return { build_unit: 'week', period_unit: 'month' };
      default:
        return { build_unit: 'hour', period_unit: 'day' };
    }
  }
}
