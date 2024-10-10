import {PlatformCredential} from "@/interface";

export const apikey: PlatformCredential = {
  // 只在 fields 更改时变化
  platform: "steam",
  version: 1,
  credentialType: 'apiToken',
  autoRefreshable: false,
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

// provider credentials need refresh
// return updated credentials
// export const refreshMethod = (ctx)=> {
//
// }