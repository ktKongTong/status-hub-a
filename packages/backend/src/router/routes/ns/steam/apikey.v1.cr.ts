import {PlatformCredential} from "@/types";

export const credential: PlatformCredential = {
  // 只在 fields 更改时变化
  platform: "steam",
  version: 1,
  credentialType: 'apiToken',
  autoRefreshable: false,
  description: "steam 的 APIKey,参见 https://steamcommunity.com/dev/apikey",
  expectExpires: 0,
  fields: {
    apiKey: {
      type: 'string',
      isRequired: true,
      description: 'apiKey'
    },
    steamid: {
      type: 'string',
      isRequired: false,
      description: 'steamid'
    }
  }
}

export interface SteamAPIKeyCredential {
  apiKey: string,
  steamid?: string
}