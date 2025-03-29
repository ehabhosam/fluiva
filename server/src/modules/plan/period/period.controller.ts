import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { PeriodService } from './period.service';
import { BlockService } from 'src/modules/block/block.service';

@Controller('period')
export class PeriodController {
  constructor(
    private readonly periodService: PeriodService,
    private readonly blockService: BlockService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get(':period_id')
  async getPeriodBlocks(@Request() req, @Param('period_id') periodId: string) {
    return await this.blockService.getBlocks(parseInt(periodId), req);
  }
}
