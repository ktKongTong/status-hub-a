import {  Namespace } from "@/interface";
import {apikey} from "./apikey.v1.cr";

interface SteamCredential {
    apikey: string;
    steamid: string;
}


export const namespace: Namespace = {
  platform: 'steam',
  category: ['game'],
  supportCredentials: [apikey],
}