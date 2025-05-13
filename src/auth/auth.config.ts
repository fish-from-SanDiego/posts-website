import { TypeInput } from 'supertokens-node/types';
import { AppConfig } from '../config/app.config.type';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session from 'supertokens-node/recipe/session';
import UserRoles from 'supertokens-node/recipe/userroles';
import Dashboard from 'supertokens-node/recipe/dashboard';

export function getDomain(domainBase: string, port: number) {
  return `${domainBase}:${port}`;
}

export function getSuperTokensConfig(appConfig: AppConfig): TypeInput {
  console.log(getDomain(appConfig.domain, appConfig.port));
  return {
    supertokens: {
      connectionURI: appConfig.superTokensConnectionUrl,
    },
    appInfo: {
      appName: 'My App',
      apiDomain: getDomain(appConfig.domain, appConfig.port),
      websiteDomain: getDomain(appConfig.domain, appConfig.port),
      apiBasePath: '/auth',
      websiteBasePath: '/auth',
    },
    recipeList: [
      Dashboard.init(),
      EmailPassword.init(),
      Session.init({
        getTokenTransferMethod: (input) => {
          return 'cookie';
        },
      }),
      UserRoles.init(),
    ],
  };
}
