import {Context} from "hono";
import {CredentialType} from "../../../../interface";
import {createSpotifyAPI} from "./spotify";

const handler = async (c:Context) => {
  const steamid = c.req.param('id')
  const {getCredentialByPlatformAndType} = await import('../../util')
  const credentials = await getCredentialByPlatformAndType(c, 'spotify', ['oauth'])
  const credentialValues =credentials[0].credentialValues
  const token = credentialValues.accessToken
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
