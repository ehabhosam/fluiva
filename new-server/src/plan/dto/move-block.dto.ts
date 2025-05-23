import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class MoveBlockDto {
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  blockId: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  targetPeriodId: number;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  targetIndex: number;
}
