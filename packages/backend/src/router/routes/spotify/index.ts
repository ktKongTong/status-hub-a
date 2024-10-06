import {Context, Hono} from "hono";
import {createSpotifyAPI} from "@/router/routes/spotify/spotify";
import {getCurrentCredential} from "@/router/routes";

export const spotifyRouter = new Hono().basePath('/spotify')

interface SpotifyOAuthCredential {
  accessToken: string;
}

spotifyRouter.get('/recent', async (c) => {
  const credentialValues =getCurrentCredential<SpotifyOAuthCredential>(c)
  const token = credentialValues.accessToken
  const api = createSpotifyAPI(token)
  const res = await api.getRecentTracks()
  return c.json(res)
})

spotifyRouter.get('/activity/recent', async (c) => {
  const before = c.req.query('before')
  const credentialValues =getCurrentCredential<SpotifyOAuthCredential>(c)
  const token = credentialValues.accessToken
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
})
export default spotifyRouter