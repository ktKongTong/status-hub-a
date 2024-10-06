import {MiddlewareHandler} from "hono"
import {getCookie} from "hono/cookie";
import {UnauthorizedError} from "@/errors";
import { getSession } from "@/middleware/auth/index";
import {getDB} from "@/middleware/db";

interface ByPassPath {
  path: string
  method: string
}

export const luciaVerifyMiddleware = (bypass: ByPassPath[] = []):MiddlewareHandler => async (c ,next) => {
  const path = new URL(c.req.url).pathname;
  const method = c.req.method;
  if (bypass.some(bypassPath => path.startsWith(bypassPath.path) && method === bypassPath.method)) {
    return next();
  }

  const { lucia } = getSession(c);
  const authorizationHeader = c.req.header("Authorization")
  const token = lucia.readBearerToken(authorizationHeader ?? "")
  if(token) {
    const { dao } = getDB(c);
    const res = await dao.userDAO.getUserAndTokenByToken(token!)
    if(res) {
      c.set("user", res.user);
      return next()
    }
  }

  const sessionId = getCookie(c, lucia.sessionCookieName) ?? null

  if (!sessionId) {
    throw new UnauthorizedError()
  }

  const { session, user } = await lucia.validateSession(sessionId!);

  if(session == null || user == null) {
    throw new UnauthorizedError()
  }

  return next();
}
