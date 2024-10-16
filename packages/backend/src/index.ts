
import { serve } from '@hono/node-server'
import {sysSchemas} from "@/route-registry";
import {initSystemSchemas} from "@/db/initial";
import {getDrizzleDB} from "@/middleware/db";
import {logger} from "status-hub-shared/utils";
import {bulLBoardRouter, onBullBoardStartup} from "@/job";
import {env} from "@/utils/env";
import {app} from "@/app";

const sysCredentialSchemas = Object.keys(sysSchemas).map(sysSchemaKey => sysSchemas[sysSchemaKey])

initSystemSchemas(getDrizzleDB(),sysCredentialSchemas).then(res => {logger.info("sys schema init success")})


serve({
  fetch: bulLBoardRouter.fetch,
  port: env("BULL_MQ_PANEL_PORT", 8419, parseInt)
})

serve({
  fetch: app.fetch,
  port: env("STATUS_HUB_PORT", 8420, parseInt),
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