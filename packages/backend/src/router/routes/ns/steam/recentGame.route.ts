import {Context} from "hono";
import {createSteamAPI} from "./steam";
import {CredentialType} from "@/interface";
import {getCredentialByPlatformAndType} from "@/router/routes/util";
import {SteamAPIKeyCredential} from "@/router/routes/ns/steam/apikey.v1.cr";

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

export const route =  {
  path: '/recent',
  raw: true,
  usableCredentialType: ['apiToken'] as CredentialType[],
  handler: handler
}
