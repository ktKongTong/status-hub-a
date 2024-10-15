import {Context} from "hono";
import {createSpotifyAPI} from "./spotify";
import {getCredentialByPlatformAndType} from "@/router/routes/util";
import {CredentialType} from "status-hub-shared/models";

const handler = async (c:Context) => {
  const credentials = await getCredentialByPlatformAndType(c, 'spotify', ['oauth'])
  const credentialValues =credentials[0].credentialValues
  const token = credentialValues.accessToken as string
  const api = createSpotifyAPI(token)
  const res = await api.getRecentTracks()
  return c.json(res)
}

export const route =  {
  path: '/recent',
  raw: true,
  supportCredentialType: ['oauth'] as CredentialType[],
  handler: handler
}
