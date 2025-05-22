import type * as grpc from '@grpc/grpc-js';
import type {
  ServiceDefinition,
  // EnumTypeDefinition,
  MessageTypeDefinition,
} from '@grpc/proto-loader';

export interface ProtoGrpcType {
  planner: {
    PlanRequest: MessageTypeDefinition;
    PlanResponse: MessageTypeDefinition;
    Period: MessageTypeDefinition;
    Routine: MessageTypeDefinition;
    TableCell: MessageTypeDefinition;
    Task: MessageTypeDefinition;
    TimeConstraintsRequest: MessageTypeDefinition;
    TimeConstraintsResponse: MessageTypeDefinition;
    Todo: MessageTypeDefinition;
    PlannerService: ServiceDefinition & {
      /**
       * Calls GeneratePlan.
       * @param request PlanRequest message
       * @param metadata Metadata
       * @param callback Response callback
       */
      generatePlan: (
        request: PlanRequest,
        metadata: grpc.Metadata,
        callback: (
          error: grpc.ServiceError | null,
          response: PlanResponse,
        ) => void,
      ) => grpc.ClientUnaryCall;
      /**
       * Calls GetTimeConstraints.
       * @param request TimeConstraintsRequest message
       * @param metadata Metadata
       * @param callback Response callback
       */
      getTimeConstraints: (
        request: TimeConstraintsRequest,
        metadata: grpc.Metadata,
        callback: (
          error: grpc.ServiceError | null,
          response: TimeConstraintsResponse,
        ) => void,
      ) => grpc.ClientUnaryCall;
    };
  };
}

export interface PlanRequest {
  build_unit: string;
  period_unit: string;
  tasks: Task[];
  routines: Routine[];
  n_periods: number;
  n_blocks: number;
}

export interface PlanResponse {
  periods: Period[];
  total_time: string;
}

export interface Period {
  cells: TableCell[];
}

export interface TableCell {
  type: string;
  todo_id: string;
}

export interface Task {
  todo: Todo;
  priority: number;
  is_breakable: boolean;
}

export interface Routine {
  todo: Todo;
  repeated_units?: number;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  required_time: number;
  type: string;
}

export interface TimeConstraintsRequest {
  tasks: Task[];
  routines: Routine[];
  blocks_unit: string;
}

export interface TimeConstraintsResponse {
  least_blocks: number;
  max_blocks: number;
  least_periods: number;
  max_periods: number;
}
