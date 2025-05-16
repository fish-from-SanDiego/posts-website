import { registerAs } from '@nestjs/config';
import * as process from 'node:process';
import { AdminConfig } from './admin.config.type';

export default registerAs<AdminConfig>('admin', () => {
  return {
    username: process.env.ADMIN_USERNAME ?? '',
    password: process.env.ADMIN_PASSWORD ?? '',
    email: process.env.ADMIN_EMAIL ?? '',
  };
});
