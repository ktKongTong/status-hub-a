import {Context, Hono} from "hono";
import {createSteamAPI} from "./steam";
import {getCurrentCredential} from "@/router/routes";


interface SteamCredential {
    apikey: string;
    steamid: string;
}

const steamRouter = new Hono().basePath('/steam')

steamRouter.get('/recent', async (c) => {
  const steamid = c.req.param('id')
  const credentialValues = getCurrentCredential<SteamCredential>(c)
  const apikey = credentialValues.apikey
  const c_steamid = credentialValues.steamid
  const api =  createSteamAPI(apikey, c_steamid)
  const res = await api.getOwnedGame(steamid)
  return c.json(res)
})

steamRouter.get('/activity/recent', async (c) => {
  const steamid = c.req.param('id')
  const credentialValues = getCurrentCredential<SteamCredential>(c)
  const apikey = credentialValues.apikey
  const c_steamid = credentialValues.steamid
  const api =  createSteamAPI(apikey, c_steamid)
  const [ recentOwnedGame,recentGamePlaytime]= await Promise.all([
    await api.getOwnedGame(steamid),
    await api.getRecentPlayTime(steamid),
  ])
  const gameActivities = recentOwnedGame.slice(0,20).map((game: any) => {
    const recentGame = recentGamePlaytime.find((recentGame: any) => recentGame.appid === game.appid);
    return {
      type: 'game',
      platform: 'steam',
      coverImage: `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`,
      name: recentGame?.name ?? 'Unknown Game',
      length: recentGame?.playtime_2weeks ?? 0,
      link: `https://store.steampowered.com/app/${game.appid}`,
      time: game.rtime_last_played * 1000,
    };
  });
  return c.json(gameActivities)
})

export default steamRouter
