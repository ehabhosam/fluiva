import { RpcException } from '@nestjs/microservices';

export class PlannerConnectionError extends RpcException {
  constructor(message = 'Cannot connect to Planner microservice') {
    super({
      code: 'UNAVAILABLE',
      message,
    });
  }
}

export class PlannerServiceError extends RpcException {
  constructor(message: string) {
    super({
      code: 'INTERNAL',
      message: `Planner service error: ${message}`,
    });
  }
}
