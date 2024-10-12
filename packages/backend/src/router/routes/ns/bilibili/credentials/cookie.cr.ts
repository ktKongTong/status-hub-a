import {  PlatformCredential } from "@/interface";

export const CookieCr: PlatformCredential = {
  // 只在 fields 更改时变化
  platform: "bilibili",
  version: 1,
  credentialType: 'cookie',
  autoRefreshable: true,
  description: "Bilibili 的网页cookie，只需要填写 SESSDATA 字段即可",
  // 30 天
  maximumRefreshIntervalInSec: 30 * 60 * 60 * 24,
  fields: {
    SESSDATA: {
      type: 'string',
      isRequired: true,
      description: 'SESSDATA'
    }
  }
}