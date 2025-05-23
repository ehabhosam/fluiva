import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PlanType } from '../../../generated/prisma';

export class UpdatePlanDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(PlanType)
  @IsOptional()
  type?: PlanType;
}
