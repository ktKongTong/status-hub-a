import {PlatformCredential} from "@/interface";

export const oauthToken: PlatformCredential = {
  // 只在 fields 更改时变化
  platform: "spotify",
  version: 1,
  credentialType: 'oauth',
  autoRefreshable: true,
  description: "Spotify 基于 OAuth 的凭证验证， accessToken 有效期 1h，可定时刷新。参见:https://developer.spotify.com/documentation/web-api/concepts/authorization",
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