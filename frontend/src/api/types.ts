// Enums
export enum PlanType {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
}

export enum TodoType {
  TASK = "TASK",
  ROUTINE = "ROUTINE",
}

export enum Priority {
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
}

// Base Types
export interface Todo {
  id: number;
  title: string;
  description: string;
  required_time: number;
  priority: Priority | null;
  is_breakable: boolean;
  type: TodoType;
  plan_id: number;
}

export interface Block {
  id: number;
  index: number;
  done_at: string | null;
  period_id: number;
  todo_id: number;
  todo?: Todo;
}

export interface Period {
  id: number;
  index: number;
  plan_id: number;
  blocks?: Block[];
}

// Response Types
export interface PlanSummary {
  id: number;
  title: string;
  description: string;
  type: PlanType;
  created_at: string;
  _count: {
    todos: number;
    periods: number;
  };
}

export interface PlanDetail {
  id: number;
  title: string;
  description: string;
  type: PlanType;
  user_id: string;
  created_at: string;
  deleted_at: string | null;
  todos: Todo[];
  periods: Period[];
}

// Request Types
export interface TaskInput {
  title: string;
  description: string;
  requiredTime: number;
  priority?: Priority;
  isBreakable: boolean;
}

export interface RoutineInput {
  title: string;
  description: string;
  requiredTime: number;
}

export interface TimeConstraintsRequest {
  tasks: TaskInput[];
  routines: RoutineInput[];
  blocksUnit: string;
}

export interface TimeConstraintsResponse {
  leastBlocks: number;
  maxBlocks: number;
  leastPeriods: number;
  maxPeriods: number;
}

export interface GeneratePlanRequest {
  title: string;
  description: string;
  type: PlanType;
  buildUnit: string;
  periodUnit: string;
  nPeriods: number;
  nBlocks: number;
  tasks: TaskInput[];
  routines: RoutineInput[];
}

export interface GeneratePlanResponse {
  plan: PlanDetail;
  totalTime: string;
}

export interface UpdatePlanRequest {
  title?: string;
  description?: string;
  type?: PlanType;
}

export interface PeriodReorder {
  periodId: number;
  newIndex: number;
}

export interface ReorderPeriodsRequest {
  periods: PeriodReorder[];
}

export interface MoveBlockRequest {
  blockId: number;
  targetPeriodId: number;
  targetIndex: number;
}

export interface BlockReorder {
  blockId: number;
  newIndex: number;
}

export interface ReorderBlocksRequest {
  periodId: number;
  blocks: BlockReorder[];
}

// Error Response
export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}
