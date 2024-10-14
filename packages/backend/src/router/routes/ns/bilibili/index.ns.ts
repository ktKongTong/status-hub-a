
import {CredentialType, Namespace} from "@/interface";
import { credential } from "./credentials/cookie.cr";


export const namespace: Namespace = {
  platform: 'bilibili',
  category: ['video'],
  supportCredentials: [credential],
  // routes: [route]
}