
import {CredentialType, Namespace} from "@/interface";
import {Cookie} from "./credentials/cookie";
import {getCredentialByPlatformAndType} from "../../util";
import {Context} from "hono";


interface BiliCookie {
  SESSDATA: string
}

const handler = async (c:Context) => {
  const credentials = await getCredentialByPlatformAndType(c, 'bilibili', ['cookie'])
  const credential = credentials[0].credentialValues
  const headers = new Headers();
  headers.append("Cookie", `SESSDATA=${credential.SESSDATA}`);
  const res = await fetch("https://api.bilibili.com/x/web-interface/history/cursor", {
    method: 'GET',
    headers: headers,
    redirect: 'follow'
  })
  const data = await res.json()
  return c.json(data)
}

const biliHistoryRoute =  {
  path: '/recent',
  raw: true,
  usableCredentialType: ['cookie'] as CredentialType[],
  handler: handler
}

export const namespace: Namespace = {
  platform: 'bilibili',
  category: ['video'],
  supportCredentials: [Cookie],
  routes: [biliHistoryRoute]
}