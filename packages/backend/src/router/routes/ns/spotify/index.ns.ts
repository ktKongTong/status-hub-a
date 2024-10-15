
import { credential as oauthToken } from "./oauth.cr";
import {Namespace} from "@/types";


export const namespace: Namespace = {
  platform: 'spotify',
  category: ['music'],
  supportCredentials: [oauthToken],
}