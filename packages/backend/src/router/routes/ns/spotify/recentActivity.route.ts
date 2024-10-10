import {Context} from "hono";
import {getCredentialByPlatformAndType} from "../../util";
import {CredentialType} from "@/interface";
import {createSpotifyAPI} from "./spotify";

const handler = async (c:Context) => {
  const before = c.req.query('before')
  const credentials = await getCredentialByPlatformAndType(c, 'steam', ['apiToken'])
  const credential = credentials[0].credentialValues
  const token = credential.accessToken as string
  const api = createSpotifyAPI(token)
  const recentTracks = await api.getRecentTracks(10)
  const spotifyActivities = recentTracks.map((recentTrack: any) => ({
    id: Math.random().toString(36),
    type: 'music',
    platform: 'spotify',
    author: recentTrack.track.artists[0].name,
    name: recentTrack.track.name,
    coverImage: recentTrack.track.album.images[0].url,
    link: recentTrack.track.external_urls.spotify,
    time: new Date(recentTrack.played_at).getTime(),
  }))
  return c.json(spotifyActivities)
}

export const route =  {
  path: '/activity/recent',
  raw: true,
  usableCredentialType: ['oauth'] as CredentialType[],
  handler: handler
}
