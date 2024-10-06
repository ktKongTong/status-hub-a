import {Context, MiddlewareHandler} from "hono";
import {getCookie} from "hono/cookie";
import {getSession} from "@/middleware/auth/index";
import {getDB} from "@/middleware/db";






export const luciaSessionMiddleware = ():MiddlewareHandler => async (c ,next) => {
  const { lucia } = getSession(c);
  // getToken
  const { dao } = getDB(c);
  const authorizationHeader = c.req.header("Authorization")
  const token = lucia.readBearerToken(authorizationHeader ?? "")
  if(token) {
    const res = await dao.userDAO.getUserAndTokenByToken(token!)
    if(res) {
      c.set("user", res.user);
      return next()
    }
  }

  const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;
  if (!sessionId) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
      append: true
    });
  }
  if (!session) {
    c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
      append: true,
    });
  }
  c.set("user", user);
  c.set("session", session);
  return next();
}
