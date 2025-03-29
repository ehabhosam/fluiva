import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMultipleTasksDto } from './dto/createMultipleTasks';
import { CreateTaskDto } from './dto/createTaskDto';
import { Task as DBTask, PrismaClient } from '@prisma/client';
import PlannerTask from 'planner/task';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async createTask(data: CreateTaskDto, prisma?: PrismaClient) {
    const { planId, requiredTime, ...rest } = data;
    const _prisma = prisma || this.prisma;

    return await _prisma.task.create({
      data: {
        ...rest,
        required_time: requiredTime,
        plan: {
          connect: {
            id: data.planId,
          },
        },
      },
    });
  }

  async addMultipleTasks({
    tasks,
    planId,
    prisma,
  }: CreateMultipleTasksDto): Promise<PlannerTask[]> {
    const createdTasks = await Promise.all(
      tasks.map(async (task) => {
        const db_task = await this.createTask(
          {
            ...task,
            planId,
          },
          prisma,
        );

        return this.formatTaskToPlannerTask(db_task);
      }),
    );

    return createdTasks;
  }

  formatTaskToPlannerTask(task: DBTask): PlannerTask {
    return {
      id: task.id.toString(),
      title: task.title,
      description: task.description,
      required_time: task.required_time,
      priority:
        task.priority === 'HIGH' ? 1 : task.priority === 'NORMAL' ? 2 : 3,
      type: 'task',
      isDivisible: task.divisible,
    };
  }

  // async getTasksByPlanId(planId: string) {
  //     return await this.prisma.task.findMany({
  //     where: {
  //         plan_id: Number(planId),
  //     },
  //     });
  // }

  // async getTaskById(taskId: string) {
  //     return await this.prisma.task.findUnique({
  //     where: {
  //         id: Number(taskId),
  //     },
  //     });
  // }
}
