
import { credential as oauthToken } from "./oauth.cr";
import {Namespace} from "@/interface";


export const namespace: Namespace = {
  platform: 'spotify',
  category: ['music'],
  supportCredentials: [oauthToken],
  // routes: [spotifyRecentActivityRoute, spotifyRecentRoute]
}