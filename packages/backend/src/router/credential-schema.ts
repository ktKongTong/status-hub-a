import {getDB} from "@/middleware/db";
import { NotFoundError } from "@/errors";
import { OpenAPIHono, z } from "@hono/zod-openapi";
import R from '@/utils/openapi'
import {
  CredentialSchemaInsertSchema,
  CredentialSchemaOpenAPISchema,
  CredentialSchemaUpdateOpenApiSchema,
} from "status-hub-shared/models";

const credentialSchemaRouter = new OpenAPIHono()

credentialSchemaRouter.openapi(
  R.get('/api/credential-schema')
    .respBodySchema(z.array(CredentialSchemaOpenAPISchema))
    .buildOpenAPI('get All Avaliable Credential Schema'),
  async (c) => {
    const {dao: db} = getDB(c)
    const schemas = await db.schemaDAO.getCredentialSchemas()
    return c.json(schemas)
})

credentialSchemaRouter.openapi(
  R
  .post('/api/credential-schema')
  .reqBodySchema(CredentialSchemaInsertSchema)
  .respBodySchema(CredentialSchemaOpenAPISchema)
  .buildOpenAPIWithReqBody('create new Credential Schema')
  , async (c) => {
    const {dao: db} = getDB(c)
    const body = c.req.valid('json')
    const newSchema = await db.schemaDAO.createCredentialSchema(body)
    return c.json(newSchema)
})

credentialSchemaRouter.openapi(
  R
    .get('/api/credential-schema/{id}')
    .reqParamSchema(z.object({
      id: z.string().min(3).openapi({ param: {name: 'id', in: 'path'}, example: '1212121',}),
    }))
    .respBodySchema(CredentialSchemaOpenAPISchema)
    .buildOpenAPI('get Credential Schema by schema id, include history version')
, async (c) => {
  const {dao: db} = getDB(c)
    const id = c.req.param('id')
  const schema = await db.schemaDAO.getCredentialSchemaById(id)
  if (!schema) {
    throw new NotFoundError('未找到凭证模式')
  }
  return c.json(schema)
})

credentialSchemaRouter.openapi(
  R
  .put('/api/credential-schema/{id}')
  .reqParamSchema(z.object({
    id: z.string().min(3).openapi({ param: {name: 'id', in: 'path'}, example: '1212121',}),
  }))
  .reqBodySchema(CredentialSchemaUpdateOpenApiSchema)
  .respBodySchema(CredentialSchemaOpenAPISchema)
  .buildOpenAPIWithReqBody('update credential schema, actually create a new version')
  , async (c) => {
  const {dao: db} = getDB(c)
  const id = c.req.param('id')
  const body = c.req.valid('json')
  const updatedSchema = await db.schemaDAO.updateCredentialSchema(body)
  return c.json(updatedSchema)
})

credentialSchemaRouter.openapi(
  R
    .delete('/api/credential-schema/{id}')
    .buildOpenAPI('remove credential schema by id')
  , async (c) => {
  const {dao: db} = getDB(c)
  const id = c.req.param('id')
  const result = await db.schemaDAO.deleteCredentialSchema(id)
  if (!result) {
    throw new NotFoundError(`未找到 id 为 ${id} 的凭证schema`)
  }
  return c.json({ message: '凭证模式已成功删除' })
})



export default credentialSchemaRouter