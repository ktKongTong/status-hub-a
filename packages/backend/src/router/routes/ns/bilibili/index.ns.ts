
import {CredentialType, Namespace} from "@/interface";
import {CookieCr} from "./credentials/cookie.cr";


export const namespace: Namespace = {
  platform: 'bilibili',
  category: ['video'],
  supportCredentials: [CookieCr],
  // routes: [route]
}