
import {oauthToken} from "./credential";
import {Namespace} from "@/interface";
import {spotifyRecentActivityRoute} from "./recentActivity";
import {spotifyRecentRoute} from "./recentMusic";


export const namespace: Namespace = {
  platform: 'spotify',
  category: ['music'],
  supportCredentials: [oauthToken],
  routes: [spotifyRecentActivityRoute, spotifyRecentRoute]
}