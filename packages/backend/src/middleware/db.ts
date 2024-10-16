import type {Context, MiddlewareHandler} from "hono";
import { DAO } from "@/db/dao";
import {DBInstance} from "@/db";

declare module 'hono' {
    interface ContextVariableMap {
        dao: DAO
    }
}


export const getDrizzleDB = () => {
    return DBInstance.db
}
export const getDB = (c:Context) => {
    return {
        db: DBInstance.db,
        dao: DBInstance.dao
    }
}

export const DBMiddleware = (): MiddlewareHandler => {
    return async (c, next) => {
        // c.set('db', DBInstance.db)
        c.set('dao', DBInstance.dao)
        await next()
    }
}