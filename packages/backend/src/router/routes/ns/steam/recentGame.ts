import {Context} from "hono";
import {getCredentialByPlatformAndType} from "../../util";
import {createSteamAPI} from "./steam";
import {CredentialType} from "../../../../interface";

const handler = async (c:Context) => {
  const steamid = c.req.param('id')
  const credentials = await getCredentialByPlatformAndType(c, 'steam', ['apiToken'])
  const credential = credentials[0].credentialValues
  const apikey = credential.apikey
  const c_steamid = credential.steamid
  const api =  createSteamAPI(apikey, c_steamid)
  const res = await api.getOwnedGame(steamid)
  return c.json(res)
}

export const steamRecentGameRoute =  {
  path: '/recent',
  raw: true,
  usableCredentialType: ['apiToken'] as CredentialType[],
  handler: handler
}
