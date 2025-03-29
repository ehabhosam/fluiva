import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { ApiKeyGuard } from './app.gaurd';
import { AppService } from './app.service';
import { AuthGuard } from './modules/auth/auth.gaurd';
import { AuthModule } from './modules/auth/auth.module';
import { BlockModule } from './modules/block/block.module';
import { PlanModule } from './modules/plan/plan.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RoutineModule } from './modules/routine/routine.module';
import { TaskModule } from './modules/task/task.module';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    PlanModule,
    RoutineModule,
    TaskModule,
    BlockModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
