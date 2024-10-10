
import {oauthToken} from "./credential";
import {Namespace} from "@/interface";


export const namespace: Namespace = {
  platform: 'spotify',
  category: ['music'],
  supportCredentials: [oauthToken],
  // routes: [spotifyRecentActivityRoute, spotifyRecentRoute]
}