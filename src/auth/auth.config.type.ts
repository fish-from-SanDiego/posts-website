import { AppInfo } from 'supertokens-node/types';

export const SupertokensConfigInjectionToken =
  'SupertokensConfigInjectionToken';

export type AuthModuleConfig = {
  appInfo: AppInfo;
  connectionURI: string;
  apiKey?: string;
};
