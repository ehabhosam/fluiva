export interface Todo {
  id: string;
  title: string;
  description: string;
  required_time: number;
  type: string;
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

export interface TableCell {
  type: string;
  todo_id: string;
}

export interface Period {
  cells: TableCell[];
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

enum TaskDtoPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
}

interface TaskDto {
  title: string;
  description: string;
  requiredTime: number;
  priority?: TaskDtoPriority;
  isBreakable: boolean;
}

interface RoutineDto {
  title: string;
  description: string;
  requiredTime: number;
}

export interface TimeConstraintsRequest {
  tasks: TaskDto[];
  routines: RoutineDto[];
  blocksUnit: string;
}

export interface TimeConstraintsResponse {
  least_blocks: number;
  max_blocks: number;
  least_periods: number;
  max_periods: number;
}
