import {
  IsInt,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class BlockOrderItem {
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  blockId: number;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  newIndex: number;
}

export class ReorderBlocksDto {
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  periodId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlockOrderItem)
  blocks: BlockOrderItem[];
}
