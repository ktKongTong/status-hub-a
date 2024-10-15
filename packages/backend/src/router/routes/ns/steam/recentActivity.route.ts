import {Context} from "hono";
import {createSteamAPI} from "./steam";
import {getCredentialByPlatformAndType} from "@/router/routes/util";
import {SteamAPIKeyCredential} from "@/router/routes/ns/steam/apikey.v1.cr";
import {CredentialType} from "status-hub-shared/models";

const handler = async (c:Context) => {
  const steamid = c.req.param('id')
  const credentials = await getCredentialByPlatformAndType(c, 'steam', ['apiToken'])
  // maybe zod parse?
  const credential = credentials[0].credentialValues as unknown as SteamAPIKeyCredential
  const apikey = credential.apiKey
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
  supportCredentialType: ['apiToken'] as CredentialType[],
  handler: handler
}
