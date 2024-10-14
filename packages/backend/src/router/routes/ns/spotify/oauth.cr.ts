import {PlatformCredential} from "@/interface";
import {RefreshFunction} from "@/types";
import {Spotify} from "arctic";
import {CredentialRefresh} from "status-hub-shared/models";

export const credential: PlatformCredential = {
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


export const refreshFunc : RefreshFunction = async (credential: CredentialRefresh, env?:any)=> {
  const spotify = new Spotify(process.env.SPOTIFY_CLIENT_ID!, process.env.SPOTIFY_CLIENT_SECRET!, process.env.SPOTIFY_REDIRECT_URL!);
  const res = await spotify.refreshAccessToken(credential.credentialValues['refreshToken'] as string)
  credential.credentialValues['accessToken'] = res.accessToken()
  if(res.hasRefreshToken()) {
    credential.credentialValues['refreshToken'] = res.refreshToken()
  }
  return {
    values: credential.credentialValues,
    isActive: true,
    status: 'ok',
    ok: true
  }
}