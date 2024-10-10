import {PlatformCredential} from "@/interface";

export const pat: PlatformCredential = {
  // 只在 fields 更改时变化
  platform: "github",
  version: 1,
  credentialType: 'apiToken',
  autoRefreshable: false,
  maximumRefreshIntervalInSec: 0,
  fields: {
    token: {
      type: 'string',
      isRequired: true,
      description: 'PAT token'
    },
    username: {
      type: 'string',
      isRequired: true,
      description: 'username'
    }
  }
}