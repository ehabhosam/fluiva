import { Injectable } from '@nestjs/common';

// import zan2a from '../../planner/zan2a';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Saba7 el fol yabn elkelab!';
  }
  // getZan2aPlan(): string {
  //   zan2a();
  //   return 'plan should be printed in the console';
  // }
}
