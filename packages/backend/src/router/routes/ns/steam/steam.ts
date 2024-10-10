import fetch from "@/utils/fetch";

export const createSteamAPI = (key: string, currentSteamID?: string) => {
    const currentSteamId = currentSteamID;
    const f = fetch.extend({
      baseURL: 'https://api.steampowered.com',
      headers: {
        AcceptLanguage: 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
      }
    })
    async function getRecentPlayTime(steamid?: string) {
      const res = await f.get(`/IPlayerService/GetRecentlyPlayedGames/v1/?key=${key}&steamid=${steamid ?? currentSteamID}`)
      return res?.response?.games ?? []
    }
  
    async function getOwnedGame(steamid?: string) {
      const res =  await f.get(`/IPlayerService/GetOwnedGames/v1/?key=${key}&steamid=${steamid ?? currentSteamID}`)
      const games = res?.response?.games ?? []
      games.sort((a: any, b: any) => b.rtime_last_played - a.rtime_last_played)
      return games
    }
  
    return {
      getRecentPlayTime,
      currentSteamId,
      getOwnedGame
    }
  
  }