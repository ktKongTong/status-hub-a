import {Job, Queue} from 'bullmq'
import { getDB } from "@/middleware/db";
import {CredentialRefresh} from "status-hub-shared/models";
import {GitHub, Spotify} from "arctic";
import {logger} from "status-hub-shared/utils";
import { HonoAdapter } from "@bull-board/hono";
import {serveStatic} from "@hono/node-server/serve-static";
import {Hono} from "hono";
import {basicAuth} from "hono/basic-auth";
import {randomString} from "@/utils";
import {BullMQAdapter} from "@bull-board/api/bullMQAdapter.js";
import {createBullBoard} from "@bull-board/api";
import {env} from "@/utils/env";
const redisHost =  env("BULLMQ_REDIS_HOST", "localhost" as string);
const port = env("BULLMQ_REDIS_PORT", 6379, parseInt);
const connection = {
  host: redisHost,
  port: port,
}

const serverAdapter = new HonoAdapter(serveStatic);
const basePath = '/admin/queues'
serverAdapter.setBasePath(basePath);
const bulLBoardRouter = new Hono();

const queueBoard = createBullBoard({
  queues: [],
  serverAdapter,
});

const randomPW = randomString(4)

bulLBoardRouter
  .use('/admin/queues', basicAuth({
    username: process.env.BULL_PANEL_UNAME ?? 'admin',
    password: process.env.BULL_PANEL_PASSWD ?? randomPW,
  }))
  .route(basePath, serverAdapter.registerPlugin());

const onBullBoardStartup = ({ address, port }: {address: string, port: number}) => {
  logger.info(`Running on ${address}:${port}...`);
  logger.info(`For the UI of instance1, open http://${address}:${port}/admin/queues`);
  logger.info('Make sure Redis is running on port 6379 by default');
  if(!process.env.BULL_PANEL_PASSWD) {
    logger.info(`default basic access passwd:${randomPW}`)
  }
}

export { bulLBoardRouter,onBullBoardStartup }


import { Worker } from 'bullmq';
import {JobQueue, Task} from "@/job/interface";
import {SystemOAuthTokenJob} from "@/job/token-refresh/oauth-token-refresh";
import {Every5minTokenRefreshCheckerJob} from "@/job/token-refresh/every-5-min-refresh-checker";


export class BullMQQueue implements JobQueue {
  queues: Record<string, Queue> = {};
  workers: Record<string, Worker> = {};
  constructor() {
    const systemOAuthTokenRefreshJob = new SystemOAuthTokenJob(connection)
    const schedule5minRefreshJob = new Every5minTokenRefreshCheckerJob(connection, systemOAuthTokenRefreshJob.queue)
    queueBoard.addQueue(new BullMQAdapter(systemOAuthTokenRefreshJob.queue))
    queueBoard.addQueue(new BullMQAdapter(schedule5minRefreshJob.queue))
  }

  private init() {
  }
  createTask(task: Task): void {
    throw new Error("Method not implemented.");
  }
}