import {Context} from "hono";
import {createSteamAPI} from "./steam";
import {getCredentialByPlatformAndType} from "@/router/routes/util";
import {SteamAPIKeyCredential} from "@/router/routes/ns/steam/apikey.v1.cr";
import { RouteItem} from "@/types";
import {CredentialType} from "status-hub-shared/models";

const handler = async (c:Context) => {
  const steamid = c.req.param('id')
  const credentials = await getCredentialByPlatformAndType(c, 'steam', ['apiToken'])
  const credential = credentials[0].credentialValues as unknown as SteamAPIKeyCredential
  // todo, verify credential
  const apikey = credential.apiKey
  const c_steamid = credential.steamid
  const api =  createSteamAPI(apikey, c_steamid)
  const res = await api.getOwnedGame(steamid)
  return c.json(res)
}


export const route: RouteItem<'/recent'> = {
  path: '/recent' as const,
  raw: true,
  supportCredentialType: ['apiToken'] as CredentialType[],
  handler: handler
}