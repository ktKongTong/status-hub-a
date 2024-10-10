import {env} from "./env";

export const config = {
  ua: env<string>('UA','(StatusHub)')


}