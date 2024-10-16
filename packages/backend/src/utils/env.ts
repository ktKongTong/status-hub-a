import {Context} from "hono";

import dotenv from 'dotenv'
dotenv.config();

let envs = () => process.env

export const isDebug = () => envs().DEBUG === 'true'
export const isTesting = () => envs().NODE_ENV === 'test'

export const isProd = (c?:Context) => envs().NODE_ENV === 'production'


type EnvType = boolean | string | number

export const env = <T>(key:string, defaultValue?: T, converter?:(i:string) => T):T => {
  const res =  process.env[key] as string
  if(res) {
    return converter?.(res) ?? res as T
  }
  return defaultValue ?? undefined as T
}