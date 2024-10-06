import {Context} from "hono";

export const isDebug = () => process.env.NODE_ENV === 'development'
export const isProd = (c?:Context) => process.env.NODE_ENV === 'development'


export const env = <T>(key:string, defaultValue?: T,  converter?:(i:string) => T):T => {
  const res =  process.env[key] as string
  if(res) {
    console.log(`${key} : ${res}`)
    return converter?.(res) ?? res as T
  }
  return defaultValue as T
}