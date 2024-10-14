import type {Context, MiddlewareHandler} from "hono";
import {BullMQQueue} from "@/job";
import {JobQueue} from "@/job/interface";

type MQ = JobQueue

declare module 'hono' {
  interface ContextVariableMap {
    mq: MQ
  }
}

const mq = new BullMQQueue()

export const getQueue = (c:Context) => {
  return c.get('mq') ?? mq
}

export const QueueMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    c.set('mq', mq)
    await next()
  }
}