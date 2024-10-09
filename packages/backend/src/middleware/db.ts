import { drizzle } from "drizzle-orm/better-sqlite3";
import type {Context, MiddlewareHandler} from "hono";
import { DAO } from "@/db/dao";
declare module 'hono' {
    interface ContextVariableMap {
        db: DBClient
        dao: DAO
    }
}


import Database from "better-sqlite3";

const sqlite =new  Database('./data/sqlite.db');

export const db = drizzle(sqlite);

export const dao = new DAO(db)

type DBClient = typeof db

export const getDB = (c:Context) => {
    return {
        db,
        dao
    }
}

export const DBMiddleware = (): MiddlewareHandler => {
    return async (c, next) => {
        // c.set('db', db)
        // c.set('dao', dao)
        await next()
    }
}