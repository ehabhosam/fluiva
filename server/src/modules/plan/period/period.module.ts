import { Module } from '@nestjs/common';
import { PeriodService } from './period.service';
import { PeriodController } from './period.controller';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { BlockModule } from 'src/modules/block/block.module';

@Module({
  controllers: [PeriodController],
  providers: [PeriodService],
  imports: [PrismaModule, BlockModule],
  exports: [PeriodService],
})
export class PeriodModule {}
