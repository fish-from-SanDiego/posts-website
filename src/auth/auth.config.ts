import { AppConfig } from '../config/app.config.type';
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
    },
    apiKey: appConfig.superTokensApiKey,
  };
}
