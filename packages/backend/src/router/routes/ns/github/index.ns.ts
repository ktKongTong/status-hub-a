import {pat} from "./credential.cr";
import {Namespace} from "@/interface";


export const namespace: Namespace = {
  platform: 'github',
  category: ['programing'],
  supportCredentials: [pat],
  // routes: [githubRecentActivityRoute, githubRecentEventRoute]
}