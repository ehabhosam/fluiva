import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    console.log('server received a request');
    return this.appService.getHello();
  }
}
