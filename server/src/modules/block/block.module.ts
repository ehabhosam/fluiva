import { Module } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [BlockController],
  providers: [BlockService],
  imports: [PrismaModule],
  exports: [BlockService],
})
export class BlockModule {}
