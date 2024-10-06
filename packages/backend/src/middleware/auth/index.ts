import {Context, MiddlewareHandler} from "hono";
import {Lucia, Session, TimeSpan, User} from 'lucia'
import {DrizzleSQLiteAdapter} from "@lucia-auth/adapter-drizzle";

import {GitHub, Spotify} from "arctic";

import {sessions, users} from "@/db/schema";
import {db, getDB} from "@/middleware/db";
import {env} from "@/utils/env";


declare module 'hono' {
  interface ContextVariableMap {
    user: User| null
    session: Session | null
    lucia: Lucia
    oauthProviders: Record<string, any>
  }
}

interface GitHubOAuthProviderEnv extends Record<string, string> {
  GITHUB_CLIENT_ID: string
  GITHUB_CLIENT_SECRET: string
  GITHUB_REDIRECT_URL: string
  SPOTIFY_CLIENT_SECRET: string
  SPOTIFY_CLIENT_ID: string
}

const adapter = new DrizzleSQLiteAdapter(db, sessions, users);
const github = new GitHub(env("GITHUB_CLIENT_ID"), env("GITHUB_CLIENT_SECRET"), env("GITHUB_REDIRECT_URL"));
const spotify = new Spotify(env("SPOTIFY_CLIENT_ID"), env("SPOTIFY_CLIENT_SECRET"), env("SPOTIFY_REDIRECT_URL"));
const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(2, "w"),
  sessionCookie: {
    name: 'status-hub-cookie',
    expires: false,
    attributes: {
      // secure: true,
      // domain: "localhost",
      secure: process.env.NODE_ENV === 'production',
    }
  }
})

const providers = {
  'github-oauth': new GitHub(process.env.GITHUB_AUTH_CLIENT_ID!, process.env.GITHUB_AUTH_CLIENT_SECRET!, process.env.GITHUB_AUTH_REDIRECT_URL!),
  github: github,
  spotify
}

export type OauthAdapterKey = keyof typeof providers
export const ProviderScopeMap: Record<OauthAdapterKey, string[]> = {
  "github-oauth": ["user:email","read:user"],
  github: ["user:email","read:user"],
  spotify: ["user-read-private", "user-read-currently-playing", "user-read-playback-state", "user-top-read", "user-read-recently-played"]
}

export const getOAuthProviderScope = (c:Context,provider: OauthAdapterKey) => {
  return ProviderScopeMap[provider]
}

export const isSupportOAuthPlatform = (c:Context, platform: string) =>{
  return ProviderScopeMap[platform as OauthAdapterKey] != undefined
}

export const getOAuthProvider = (c:Context,provider: OauthAdapterKey) => {
  // const providers = c.get('oauthProviders')
  return providers[provider]
}

export const getLucia = (c: Context) => {
  return lucia
}

export const getSession = (c:Context) => {
  return {
    user: c.get("user"),
    session: c.get("session"),
    lucia: lucia,
    oauthProvider: providers,
  }
}


// for node env, no need set db or other

export const luciaMiddleware = ():MiddlewareHandler => async (c, next) => {
  // const db = getDB(c)
  // const e = env<GitHubOAuthProviderEnv>(c);
  // c.set("oauthProviders", providers)
  // c.set("lucia", lucia);
  return next();
}

export {
  luciaSessionMiddleware as sessionMiddleware,
} from './session'
export {
  luciaVerifyMiddleware as verifyMiddleware,
} from './verify'