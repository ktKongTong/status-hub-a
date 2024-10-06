
import { serve } from '@hono/node-server'
import { DBMiddleware } from "@/middleware/db"
import {luciaMiddleware, sessionMiddleware, verifyMiddleware } from "@/middleware/auth";
import loggerMiddleware from '@/middleware/logger';


import { logger } from "status-hub-shared/utils"
import {apiReference} from "@scalar/hono-api-reference";
import {createRoute, OpenAPIHono, z} from "@hono/zod-openapi";

import {loginRouter} from "@/router/auth/login";
import {logoutRouter} from "@/router/auth/logout";
import {userRouter} from "@/router/user";
import credentialSchemaRouter from '@/router/credential-schema';
import credentialRouter from '@/router/credential';
import routes from "@/router/routes";

import R from '@/utils/openapi'
import {bulLBoardRouter, initSchedule, onBullBoardStartup} from "@/job";
import {BizError} from "@/errors";
import {env} from "@/utils/env";


const app = new OpenAPIHono()

export interface Env {
  GITHUB_CLIENT_ID: string
  GITHUB_CLIENT_SECRET: string
}



app
.use("*", loggerMiddleware)
.use("*", DBMiddleware())
.use("*",luciaMiddleware())
.use("*",sessionMiddleware())
.use("/api/*",verifyMiddleware([
  {path: '/api/credential-schema', method: 'GET'},
  {path: '/api/auth', method: 'GET'},
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

// biz
app
.route('/', userRouter)
.route('/', credentialSchemaRouter)
.route('/', credentialRouter)
//still not openapi route now
.route('/', routes)
.route('/', bulLBoardRouter)
// openapi
.doc('/api/openapi.json', {
  openapi: '3.0.0',
  info: {version: '1.0.0', title: 'StatusHub API'}
})
.get('/api/reference', apiReference({spec: {url: '/api/openapi.json'}}))


app.onError((err, c)=> {
  if (err instanceof BizError) {
    c.header('X-StatusHub-Biz-Error', err.name);
    logger.error(err.stack);
    return c.json({ error: err.message }, err.status);
  } else {
    {
      logger.error(err.stack);
      return c.json({error: '服务器内部错误'}, 500);
    }
  }
})

initSchedule()
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