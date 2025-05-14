import { TypeInput } from 'supertokens-node/types';
import { AppConfig } from '../config/app.config.type';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session from 'supertokens-node/recipe/session';
import UserRoles from 'supertokens-node/recipe/userroles';
import Dashboard from 'supertokens-node/recipe/dashboard';
import { AuthModuleConfig } from './auth.config.type';

// import ThirdParty from 'supertokens-node/recipe/thirdparty';

export function getDomain(domainBase: string, port: number) {
  return `${domainBase}:${port}`;
}

export function getSuperTokensConfig(appConfig: AppConfig): AuthModuleConfig {
  return {
    connectionURI: appConfig.superTokensConnectionUrl,
    appInfo: {
      appName: 'My App',
      apiDomain: getDomain(appConfig.domain, appConfig.port),
      websiteDomain: getDomain(appConfig.domain, appConfig.port),
      apiBasePath: '/auth',
      websiteBasePath: '/auth',
    },
    apiKey: appConfig.superTokensApiKey,
  };
}
