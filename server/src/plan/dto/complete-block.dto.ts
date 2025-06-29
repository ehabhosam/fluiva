import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CompleteBlockDto {
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  blockId: number;

  @IsOptional()
  completed?: boolean = true; // If false, it will mark as incomplete
}
