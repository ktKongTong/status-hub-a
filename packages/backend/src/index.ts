
import { serve } from '@hono/node-server'
import {DBMiddleware, getDrizzleDB} from "@/middleware/db"
import { luciaMiddleware, sessionMiddleware, verifyMiddleware } from "@/middleware/auth";
import loggerMiddleware from '@/middleware/logger';
import {KVMiddleware} from "@/middleware/kv";
import {QueueMiddleware} from "@/middleware/queue";
import { logger } from "status-hub-shared/utils"
import {apiReference} from "@scalar/hono-api-reference";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

import {loginRouter} from "@/router/auth/login";
import {logoutRouter} from "@/router/auth/logout";
import {userRouter} from "@/router/user";
import credentialSchemaRouter from '@/router/credential-schema';
import credentialRouter from '@/router/credential';
import routes from "@/router/routes";


const app = new OpenAPIHono()

app
.use("*", loggerMiddleware)
.use("*", DBMiddleware())
.use("*", KVMiddleware())
.use("*",QueueMiddleware())
.use("*",luciaMiddleware())
.use("*",sessionMiddleware())
.use("/api/*",verifyMiddleware([
  {path: '/api/credential-schema', method: 'GET'},
  {path: '/api/auth', method: 'GET'},
  {path: '/api/auth/sign-in', method: 'POST'},
  {path: '/api/auth/sign-up', method: 'POST'},
  {path: '/api/reference', method: 'GET'},
  {path: '/api/openapi.json', method: 'GET'},
]))

// auth
app
  .route('/', loginRouter)
  .route('/', logoutRouter)

// healthy check
app
  .openapi(
    R
      .get('/ping')
      .respBodySchema(z.object({data: z.string()}))
      .buildOpenAPI('health check'),
    (c) => c.json({data: 'pong'})
  )

import R from '@/utils/openapi'
import {bulLBoardRouter, onBullBoardStartup} from "@/job";
import { BizError } from "@/errors";
import {env} from "@/utils/env";
// biz
app
.route('/', userRouter)
.route('/', credentialSchemaRouter)
.route('/', credentialRouter)
.route('/', routes)
.route('/', bulLBoardRouter)


import {nsRouter, sysSchemas} from '@/route-registry'
import {initSystemSchemas} from "@/db/initial";
app
.route('/', nsRouter)
// openapi
.doc('/api/openapi.json', {
  openapi: '3.0.0',
  info: {version: '1.0.0', title: 'StatusHub API'}
})
.get('/api/reference', apiReference({spec: {url: '/api/openapi.json'}}))


const sysCredentialSchemas = Object.keys(sysSchemas).map(sysSchemaKey => sysSchemas[sysSchemaKey])
initSystemSchemas(getDrizzleDB(),sysCredentialSchemas).then(res => {logger.info("sys schema init success")})

app.onError((err, c)=> {
  if (err instanceof BizError) {
    c.header('X-StatusHub-Biz-Error', err.name);
    return c.json({ error: err.message }, err.status);
  } else {
      logger.error(err.stack);
      return c.json({error: '服务器内部错误'}, 500);
  }
})



serve({
  fetch: app.fetch,
  port: env("PORT", 8787, parseInt),
},(addrInfo)=>{
  onBullBoardStartup(addrInfo)
  logger.info(`StatusHub Running on http://${addrInfo.address}:${addrInfo.port}/`);
})



//
// export default {
//   fetch: app.fetch,
//   async scheduled(
//     controller: ScheduledController,
//     env: Env,
//     ctx: ExecutionContext,
//   ) {
//     // Write code for updating your API
//     switch (controller.cron) {
//
//     }
//     console.log("cron processed");
//   },
// }