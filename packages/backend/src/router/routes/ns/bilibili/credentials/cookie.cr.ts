import {  PlatformCredential } from "@/types";
import {RefreshFunction} from "@/types";

export const credential: PlatformCredential = {
  platform: "bilibili",
  version: 1,
  credentialType: 'cookie',
  autoRefreshable: true,
  description: "Bilibili 的网页cookie，只需要填写 SESSDATA 字段即可",
  expectExpires: 30 * 60 * 60 * 24,
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



export const refreshFunc: RefreshFunction = async (credential) => {
  return {
    values: credential.credentialValues,
    isActive: true,
    status: 'ok',
    ok: true,
  }
}