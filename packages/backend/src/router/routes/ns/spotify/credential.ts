import {PlatformCredential} from "@/interface";

export const oauthToken: PlatformCredential = {
  // 只在 fields 更改时变化
  platform: "spotify",
  version: 1,
  credentialType: 'oauth',
  autoRefreshable: true,
  maximumRefreshIntervalInSec: 3600,
  fields: {
    accessToken: {
      type: 'string',
      isRequired: true,
      description: 'accessToken'
    },
    refreshToken: {
      type: 'string',
      isRequired: true,
      description: 'refreshToken'
    },
    scopes: {
      type: 'string',
      isRequired: false,
      description: 'scopes'
    }
  }
}