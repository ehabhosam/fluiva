import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PlanType, Priority } from '../../../generated/prisma';

export class TodoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  requiredTime: number; // in minutes
}

export class TaskDto extends TodoDto {
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsOptional()
  isBreakable?: boolean = true;
}

export class RoutineDto extends TodoDto {
  // Any routine-specific fields can be added here
}

export class GeneratePlanDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(PlanType)
  type: PlanType;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  buildUnit: string; // The unit of time for blocks (e.g., "15min", "30min")

  @IsString()
  @IsNotEmpty()
  periodUnit: string; // The unit of time for periods (e.g., "day", "hour")

  @IsInt()
  @Min(1)
  nPeriods: number; // Number of periods

  @IsInt()
  @Min(1)
  nBlocks: number; // Number of blocks per period

  @ValidateNested({ each: true })
  @Type(() => TaskDto)
  tasks: TaskDto[];

  @ValidateNested({ each: true })
  @Type(() => RoutineDto)
  routines: RoutineDto[];
}
