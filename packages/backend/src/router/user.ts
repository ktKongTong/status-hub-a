import {getDB} from "@/middleware/db";
import {getSession} from "@/middleware/auth";
import { OpenAPIHono, z } from "@hono/zod-openapi";
import R from "@/utils/openapi";
import {
  CurrentUserVOSchema,
  TokenCreateResultSchema,
  TokenCreateSchema,
} from "status-hub-shared/models/vo";
import {randomString} from "@/utils";
import {BizError, InvalidParamError} from "@/errors";
import {TokenSelectVOSchema} from "status-hub-shared/models/vo";

export const userRouter = new OpenAPIHono();


userRouter.openapi(
  R
  .get('/api/user/me')
  .respBodySchema(CurrentUserVOSchema)
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
    .respBodySchema(z.array(TokenSelectVOSchema))
    .buildOpenAPI('Retrieve current user basic info'),
  async (c) => {
    const { user} = getSession(c)
    const { dao } = getDB(c)
    const userId = user!.id
    const tokens = await dao.userDAO.getUserTokensByUserId(userId)
    const res = tokens.map(it=> (TokenSelectVOSchema.parse({
        ...it,
        shortToken: it.token.slice(0,8)
    })))
    return c.json(res)
  });


userRouter.openapi(
  R
    .post('/api/user/token')
    .reqBodySchema(TokenCreateSchema)
    .respBodySchema(TokenCreateResultSchema)
    .buildOpenAPIWithReqBody('Retrieve current user basic info'),
  async (c) => {
    const { user} = getSession(c)
    const { dao } = getDB(c)
    const userId = user!.id
    const body = c.req.valid('json')
    const exist = await dao.userDAO.checkIfTokenIdentifierExist(body.identifier,userId)
    if(exist) throw new InvalidParamError(`identifier:${body.identifier} Already Exist`)
    const res = await dao.userDAO.createUserToken({
      identifier: body.identifier,
      userId,
      token: `sh_${randomString(10)}`,
      expires: body.expires
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
    const res = await dao.userDAO.removeTokenByIdentifier(body.identifier, userId)
    return c.json({
      message: "成功删除凭证"
    })
  });