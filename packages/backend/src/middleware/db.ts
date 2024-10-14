import {BetterSQLite3Database, drizzle} from "drizzle-orm/better-sqlite3";
import type {Context, MiddlewareHandler} from "hono";
import { DAO } from "@/db/dao";
import {type Database} from "better-sqlite3";
import B3Database from "better-sqlite3";
import {existsSync, mkdirSync} from "fs";

declare module 'hono' {
    interface ContextVariableMap {
        dao: DAO
    }
}

class DBInstance {
    private static _db: BetterSQLite3Database | undefined
    private static _sqlite: Database | undefined
    private static _dao: DAO | undefined
    private constructor() {}
    private static initialized() {
        return DBInstance._sqlite !== undefined
    }
    private static init() {
        if(DBInstance._sqlite == undefined) {
            if(!existsSync('./data')) {
                mkdirSync('./data', {recursive: true});
            }
            const sqlite3 = new B3Database('./data/sqlite.db');
            const db = drizzle(sqlite3);
            DBInstance._sqlite = sqlite3
            DBInstance._db = db
            DBInstance._dao = new DAO(db)
        }
    }
    static get db() {
        if(!DBInstance.initialized()) {
            DBInstance.init()
        }
        return DBInstance._db as BetterSQLite3Database
    }
    static get dao() {
        if(!DBInstance.initialized()) {
            DBInstance.init()
        }
        return DBInstance._dao as DAO
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