import { OpenAPIHono, z} from "@hono/zod-openapi";
import R from '@/utils/openapi'
import {credentialInsertOpenAPISchema, credentialOpenAPISchema, credentialUpdateOpenAPISchema} from "status-hub-shared/models/vo";
import {getDB} from "@/middleware/db";
import {getSession} from "@/middleware/auth";
const credentialRouter = new OpenAPIHono()


credentialRouter.openapi(
  R.get('/api/credential')
    .respBodySchema(z.array(credentialOpenAPISchema))
    .buildOpenAPI('get credential by user id')
  , async (c) => {
    const { dao } = getDB(c)
    const { user} = getSession(c)
  const credentials = await dao.credentialDAO.getCredential(user!.id)
  return c.json(credentials)
})

credentialRouter.openapi(
  R.post('/api/credential')
    .reqBodySchema(credentialInsertOpenAPISchema)
    .buildOpenAPIWithReqBody('create credential refer to credential schema')
  , async (c) => {
  const { dao } = getDB(c)
  const {user} = getSession(c)
  const { schemaId, schemaVersion, credentialValues } = c.req.valid('json')
  await dao.credentialDAO.addCredential(user!.id, schemaId, schemaVersion, credentialValues)
  return c.json({ message: '凭证添加成功' })
})

credentialRouter.openapi(
  R.put('/api/credential/{id}')
    .reqParamSchema(z.object({
      id: z.string().openapi({ param: {name: 'id', in: 'path'}, example: '1',}),
    }))
    .reqBodySchema(credentialUpdateOpenAPISchema)
    .buildOpenAPIWithReqBody('update credential, may has difference credential schema version')
  , async (c) => {
  const { dao } = getDB(c)
  const res = c.req.valid('param')
  const { credentialValues } = c.req.valid('json')

  await dao.credentialDAO.updateCredential(parseInt(res.id), credentialValues)

  return c.json({ message: '凭证更新成功' })
})

credentialRouter.openapi(
  R.delete('/api/credential/{id}')
    .reqParamSchema(z.object({
      id: z.string().openapi({ param: {name: 'id', in: 'path'}, example: '1',}),
    }))
    .buildOpenAPI('remove credential by id')
  , async (c) => {
    const { dao } = getDB(c)
  const {id} = c.req.valid('param')
  await dao.credentialDAO.deleteCredential(parseInt(id))

  return c.json({ message: '凭证删除成功' })
})

export default credentialRouter