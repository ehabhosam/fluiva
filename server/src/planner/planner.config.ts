import { registerAs } from '@nestjs/config';

export default registerAs('planner', () => ({
  host: process.env.PLANNER_SERVICE_HOST || 'localhost',
  port: parseInt(process.env.PLANNER_SERVICE_PORT, 10) || 8080,
}));
