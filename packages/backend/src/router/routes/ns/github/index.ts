import {pat} from "./credential";
import {githubRecentActivityRoute} from "./recentActivity";
import {githubRecentEventRoute} from "./recentEvent";
import {Namespace} from "@/interface";


export const namespace: Namespace = {
  platform: 'github',
  category: ['programing'],
  supportCredentials: [pat],
  routes: [githubRecentActivityRoute, githubRecentEventRoute]
}