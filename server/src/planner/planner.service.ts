import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from '../generated/planner';
import { ServiceClientConstructor } from '@grpc/grpc-js/build/src/make-client';
import { join } from 'path';
import {
  PlanRequest,
  PlanResponse,
  TimeConstraintsRequest,
  TimeConstraintsResponse,
} from './planner.interfaces';
import { PlannerConnectionError, PlannerServiceError } from './planner.errors';
import plannerConfig from './planner.config';

@Injectable()
export class PlannerService implements OnModuleInit {
  private client: any;
  private readonly logger = new Logger(PlannerService.name);
  private isConnected = false;

  constructor(
    @Inject(plannerConfig.KEY)
    private config: ConfigType<typeof plannerConfig>,
  ) {
    const PROTO_PATH = join(
      process.cwd(),
      '../planner-microservice/proto/planner.proto',
    );

    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    const protoDescriptor = grpc.loadPackageDefinition(
      packageDefinition,
    ) as unknown as ProtoGrpcType;
    const plannerService = protoDescriptor.planner
      .PlannerService as unknown as ServiceClientConstructor;

    const serverAddress = `${this.config.host}:${this.config.port}`;
    this.client = new plannerService(
      serverAddress,
      grpc.credentials.createInsecure(),
    );
    this.logger.log(
      `Planner service client initialized with address: ${serverAddress}`,
    );
  }

  onModuleInit() {
    // Test connection when the module initializes
    this.testConnection().catch((err) => {
      this.logger.error(
        `Failed to connect to planner microservice: ${err.message}`,
      );
    });
  }

  private async testConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      const deadline = new Date();
      deadline.setSeconds(deadline.getSeconds() + 5);

      this.client.waitForReady(deadline, (error) => {
        if (error) {
          this.isConnected = false;
          reject(
            new PlannerConnectionError(`Connection failed: ${error.message}`),
          );
        } else {
          this.isConnected = true;
          this.logger.log('Successfully connected to planner microservice');
          resolve();
        }
      });
    });
  }

  private checkConnection() {
    if (!this.isConnected) {
      throw new PlannerConnectionError();
    }
  }

  async generatePlan(planRequest: PlanRequest): Promise<PlanResponse> {
    this.checkConnection();

    return new Promise((resolve, reject) => {
      this.client.generatePlan(planRequest, (error, response) => {
        if (error) {
          this.logger.error(`Error generating plan: ${error.message}`);
          reject(new PlannerServiceError(error.message));
          return;
        }
        resolve(response);
      });
    });
  }

  async getTimeConstraints(
    timeConstraintsRequest: TimeConstraintsRequest,
  ): Promise<TimeConstraintsResponse> {
    this.checkConnection();

    const payload = this.#prepareTimeConstraintsRequest(timeConstraintsRequest);
    return new Promise((resolve, reject) => {
      this.client.getTimeConstraints(payload, (error, response) => {
        if (error) {
          this.logger.error(`Error getting time constraints: ${error.message}`);
          reject(new PlannerServiceError(error.message));
          return;
        }
        resolve(response);
      });
    });
  }

  #prepareTimeConstraintsRequest(
    timeConstraintsRequest: TimeConstraintsRequest,
  ) {
    const mappedTasks = timeConstraintsRequest.tasks.map((task, id) => ({
      todo: {
        id: 'task-' + id,
        title: task.title,
        description: task.description,
        required_time: task.requiredTime,
        type: 'TASK',
      },
      priority: task.priority || 'NORMAL',
      is_breakable: task.isBreakable,
    }));

    const mappedRoutines = timeConstraintsRequest.routines.map(
      (routine, id) => {
        return {
          todo: {
            id: 'routine-' + id,
            title: routine.title,
            description: routine.description,
            required_time: routine.requiredTime,
            type: 'ROUTINE',
          },
        };
      },
    );

    return {
      tasks: mappedTasks,
      routines: mappedRoutines,
      blocks_unit: timeConstraintsRequest.blocksUnit,
    };
  }
}
