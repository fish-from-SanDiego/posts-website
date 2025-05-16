import { registerAs } from '@nestjs/config';
import { AppConfig } from './app.config.type';
import * as process from 'node:process';

export default registerAs<AppConfig>('app', () => {
  return {
    domain: process.env.APP_DOMAIN ?? '',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    superTokensConnectionUrl:
      process.env.SUPERTOKENS_CONNECTION_URL?.toString() ?? '',
    superTokensApiKey: process.env.SUPERTOKENS_API_KEY ?? '',
    storageBucket: process.env.STORAGE_BUCKET ?? '',
    storageAccessKey: process.env.STORAGE_ACCESS_KEY ?? '',
    storageSecretKey: process.env.STORAGE_SECRET_KEY ?? '',
  };
});
