import { getSession } from "@/middleware/auth";
import {UnauthorizedError} from "@/errors";
import {OpenAPIHono} from "@hono/zod-openapi";


export const logoutRouter = new OpenAPIHono()



logoutRouter.post("/api/auth/logout", async (c) => {
  const { session, lucia } = getSession(c)
  if (!session) throw new UnauthorizedError()
  await lucia.invalidateSession(session.id)
  c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), { append: true });
  return c.redirect("/")
})