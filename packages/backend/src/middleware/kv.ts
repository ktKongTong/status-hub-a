import type {Context, MiddlewareHandler} from "hono";

declare module 'hono' {
  interface ContextVariableMap {
    kv: Cacheable
  }
}

import { Cacheable } from 'cacheable';


const cacheable = new Cacheable()

export const getKV = (c:Context) => {
  return c.get('kv') ?? cacheable
}

export const KVMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    c.set('kv', cacheable)
    await next()
  }
}