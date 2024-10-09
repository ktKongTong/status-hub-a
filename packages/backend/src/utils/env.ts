import {Context} from "hono";

import dotenv from 'dotenv'
dotenv.config();
export const isDebug = () => process.env.DEBUG === 'true'
export const isProd = (c?:Context) => process.env.NODE_ENV === 'production'


type EnvType = boolean | string | number

export const env = <T>(key:string, defaultValue?: T, converter?:(i:string) => T):T => {
  const res =  process.env[key] as string
  if(res) {
    return converter?.(res) ?? res as T
  }
  return defaultValue as T
}