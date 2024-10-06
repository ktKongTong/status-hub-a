import {getDB} from "@/middleware/db";
import {getSession} from "@/middleware/auth";
import { OpenAPIHono } from "@hono/zod-openapi";
import R from "@/utils/openapi";
import { CurrentUserSchema } from "status-hub-shared/models";
import {randomString} from "@/utils";

export const userRouter = new OpenAPIHono();


userRouter.openapi(
  R
  .get('/api/user/me')
  .respBodySchema(CurrentUserSchema)
  .buildOpenAPI('Retrieve current user basic info'),
  async (c) => {
  // const { id } = c.req.valid('param')
  const { user} = getSession(c)
  const { dao } = getDB(c)
  const userId = user!.id
  const res = await dao.userDAO.getUserByUserId(userId)
  return c.json(res!)
});


userRouter.openapi(
  R
    .get('/api/user/token')
    .buildOpenAPI('Retrieve current user basic info'),
  async (c) => {
    const { user} = getSession(c)
    const { dao } = getDB(c)
    const userId = user!.id
    const res = await dao.userDAO.getUserTokensByUserId(userId)
    return c.json(res)
  });


userRouter.openapi(
  R
    .post('/api/user/token')
    // .reqBodySchema(CurrentUserSchema)
    .buildOpenAPI('Retrieve current user basic info'),
  async (c) => {
    const { user} = getSession(c)
    const { dao } = getDB(c)
    const userId = user!.id
    const body = await c.req.json()
    const res = await dao.userDAO.createUserToken({
      identifier: body.identifier!,
      userId,
      token: `sh_${randomString(10)}`,
      expires: 3600 * 24 * 365
    })
    return c.json(res)
  });



userRouter.openapi(
  R
    .delete('/api/user/token')
    .buildOpenAPI('Retrieve current user basic info'),
  async (c) => {
    const { user} = getSession(c)
    const { dao } = getDB(c)
    const userId = user!.id
    const body = await c.req.json()
    const res = await dao.userDAO.removeToken(userId, body.identifier)
    return c.json(res)
  });