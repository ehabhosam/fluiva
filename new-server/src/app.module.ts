import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResourcesModule } from './resources/resources.module';
import { AuthModule } from './auth/auth.module';
import { PlannerModule } from './planner/planner.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ResourcesModule,
    PlannerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
