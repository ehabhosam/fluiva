import { IsArray, IsInt, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PeriodOrderItem {
  @IsInt()
  @Min(1)
  periodId: number;

  @IsInt()
  @Min(0)
  newIndex: number;
}

export class ReorderPeriodsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PeriodOrderItem)
  periods: PeriodOrderItem[];
}
