import {Context} from "hono";
import {CredentialType} from "@/interface";
import {createSpotifyAPI} from "./spotify";
import {getCredentialByPlatformAndType} from "@/router/routes/util";

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
  usableCredentialType: ['oauth'] as CredentialType[],
  handler: handler
}
