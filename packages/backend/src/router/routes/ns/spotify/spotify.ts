import fetch from "@/utils/fetch";

export const createSpotifyAPI = (token: string) => {

  const f = fetch.extend({
    baseURL: 'https://api.spotify.com/',
    headers: {
      Authorization: `Bearer ${token}`,
      AcceptLanguage: 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    },
    responseType: 'json'
  })
  async function getTopTracks(limit: number = 5) {
    const res =  await f.get(`v1/me/top/tracks?&limit=${limit}`)
    return res.items
  }

  async function getRecentTracks(limit: number = 5) {
    const res =  await f.get(`v1/me/player/recently-played?&limit=${limit}`)
    return res.items
  }

  return {
    getTopTracks,
    getRecentTracks,
  }
}