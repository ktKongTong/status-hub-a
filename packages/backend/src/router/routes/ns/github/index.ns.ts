import { credential as pat } from "./credential.cr";

import {Namespace} from "@/types";

export const namespace: Namespace = {
  platform: 'github',
  category: ['programing'],
  supportCredentials: [pat],
}