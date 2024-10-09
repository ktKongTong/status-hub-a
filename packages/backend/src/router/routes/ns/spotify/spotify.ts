export const createSpotifyAPI = (token: string) => {
  async function fetchWebApi(endpoint: string, method: string, body?: any) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        AcceptLanguage: 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
      },
      method,
      body:JSON.stringify(body)
    });
    return await res.json();
  }
  async function getTopTracks(limit: number = 5) {
    const res =  (await fetchWebApi(`v1/me/top/tracks?&limit=${limit}`, 'GET')) as any
    return res.items
  }

  async function getRecentTracks(limit: number = 5) {
    const res = (await  fetchWebApi(`v1/me/player/recently-played?limit=${limit}`, 'GET')) as any
    return res.items
  }

  return {
    getTopTracks,
    getRecentTracks,
  }
}