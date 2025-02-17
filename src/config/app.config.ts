import { registerAs } from '@nestjs/config';
import { AppConfig } from './app-config.type';
import * as process from 'node:process';

export default registerAs<AppConfig>('app', () => {
  return {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  };
});
