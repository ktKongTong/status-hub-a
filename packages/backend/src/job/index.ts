import { Queue } from 'bullmq'
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
const redisPort = env("BULLMQ_REDIS_PORT", 6379, parseInt);
const redisPassword = env("BULLMQ_REDIS_PASSWORD");
const connection = {
  host: redisHost,
  port: redisPort,
  password: redisPassword as string | undefined,
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
import {Every5minTokenRefreshCheckerJob} from "@/job/token-refresh/every-5-min-refresh-checker";
import {SystemRefreshTask} from "@/job/token-refresh/system-refresh-task";


export class BullMQQueue implements JobQueue {
  queues: Record<string, Queue> = {};
  workers: Record<string, Worker> = {};
  constructor() {
    const systemCredentialRefreshJob = new SystemRefreshTask(connection)
    const schedule5minRefreshJob = new Every5minTokenRefreshCheckerJob(connection, systemCredentialRefreshJob.queue)
    queueBoard.addQueue(new BullMQAdapter(systemCredentialRefreshJob.queue))
    queueBoard.addQueue(new BullMQAdapter(schedule5minRefreshJob.queue))
  }

  private init() {
  }
  createTask(task: Task): void {
    throw new Error("Method not implemented.");
  }
}