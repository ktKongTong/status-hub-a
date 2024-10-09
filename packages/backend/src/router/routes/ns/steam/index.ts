import {  Namespace } from "@/interface";
import {apikey} from "./credentials";
import {steamRecentActivityRoute} from "./recentActivity";
import {steamRecentGameRoute} from "./recentGame";

interface SteamCredential {
    apikey: string;
    steamid: string;
}


export const namespace: Namespace = {
  platform: 'steam',
  category: ['game'],
  supportCredentials: [apikey],
  routes: [steamRecentActivityRoute, steamRecentGameRoute]
}