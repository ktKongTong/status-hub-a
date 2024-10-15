import {  Namespace } from "@/types";
import {credential as apikey} from "./apikey.v1.cr";



export const namespace: Namespace = {
  platform: 'steam',
  category: ['game'],
  supportCredentials: [apikey],
}