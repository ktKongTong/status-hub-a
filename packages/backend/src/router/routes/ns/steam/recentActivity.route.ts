import {Context} from "hono";
import {createSteamAPI} from "./steam";
import {CredentialType} from "../../../../interface";

const handler = async (c:Context) => {
  const steamid = c.req.param('id')
  const {getCredentialByPlatformAndType} = await import('../../util')
  const credentials = await getCredentialByPlatformAndType(c, 'steam', ['apiToken'])
  const credential = credentials[0].credentialValues
  const apikey = credential.apikey
  const c_steamid = credential.steamid
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
}

export const route =  {
  path: '/activity/recent',
  raw: true,
  usableCredentialType: ['apiToken'] as CredentialType[],
  handler: handler
}
