
import { serve } from '@hono/node-server'
import {logger} from "status-hub-shared/utils";
import {bulLBoardRouter, onBullBoardStartup} from "@/job";
import {env} from "@/utils/env";
import {app} from "@/app";

export async function main() {
  serve({
    fetch: bulLBoardRouter.fetch,
    port: env("BULL_MQ_PANEL_PORT", 8419, parseInt)
  }, (addrInfo)=>{
    onBullBoardStartup(addrInfo)
  })
  serve({
    fetch: app.fetch,
    port: env("STATUS_HUB_PORT", 8420, parseInt),
  },(addrInfo)=>{
    logger.info(`StatusHub Running on http://${addrInfo.address}:${addrInfo.port}/`);
  })
}