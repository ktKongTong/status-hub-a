

import { Hono } from "hono";
import {getDB} from "@/middleware/db";
import {
  getSession,
} from "@/middleware/auth";
import {buildCredentialValues} from "./util";

import oauthAdapter from "@/router/routes/oauth-adapter";
import {NotFoundError} from "@/errors";
const app = new Hono<{
  Variables: {
    currentCredentialValue: Record<string, any>
  }
}>().basePath('/api/route')

app.route('/', oauthAdapter)

app.get('/platforms', async (c)=> {
  // const platforms = await db.getPlatforms()
  return c.json({ })
})

app.use('/:platform/*', async (c, next) => {
  const platform = c.req.param('platform')
  const {dao: db} = getDB(c)
  const { user } = getSession(c)
  const credentials = await db.credentialDAO.getCredentialByPlatform(user!.id, platform)
  if (credentials.length === 0) {
    throw new NotFoundError(`No ${platform} credentials found.`)
  }
  const credential = credentials[0]
  const credentialValues = buildCredentialValues<any>(credential.schema.schemaFields, credential.credentialValues)
  c.set('currentCredentialValue', credentialValues)
  return next()
})

export default app