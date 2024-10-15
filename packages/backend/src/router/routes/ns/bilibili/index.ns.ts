
import { Namespace } from "@/types";
import { credential } from "./credentials/cookie.cr";


export const namespace: Namespace = {
  platform: 'bilibili',
  category: ['video'],
  supportCredentials: [credential],
}