import {Context} from "hono";
import {getCredentialByPlatformAndType} from "@/router/routes/util";
import {createBilibiliAPI} from "@/router/routes/ns/bilibili/api";
import {CredentialType} from "status-hub-shared/models";

interface BiliCookie {
  SESSDATA: string
}

const handler = async (c:Context) => {
  const credentials = await getCredentialByPlatformAndType(c, 'bilibili', ['cookie'])
  const credential = credentials[0].credentialValues
  const api =  createBilibiliAPI(credential.SESSDATA as string)
  const res = await api.getHistory()
  return c.json(res)
}

export const route =  {
  path: '/recent',
  raw: true,
  supportCredentialType: ['cookie'] as CredentialType[],
  handler: handler
}