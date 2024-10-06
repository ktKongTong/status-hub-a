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
const tokenRefreshQueue = new Queue('token-refresh-task', {connection});
const oauthTokenRefreshQueue = new  Queue('oauth-token-refresh-task', {connection,});
const serverAdapter = new HonoAdapter(serveStatic);
const basePath = '/admin/queues'
serverAdapter.setBasePath(basePath);
const bulLBoardRouter = new Hono();
createBullBoard({
  queues: [new BullMQAdapter(tokenRefreshQueue),new BullMQAdapter(oauthTokenRefreshQueue)],
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
export function initSchedule() {
  tokenRefreshQueue.upsertJobScheduler(
    'repeat-every-5min',
    {
      every: 60000 * 5, // Job will repeat every 10000 milliseconds (10 seconds)
    },
    {
      name: 'every-job',
      data: {},
      opts: {}, // Optional additional job options
    },
  );
  const db = getDB("t" as any)

  const github = new GitHub(process.env.GITHUB_CLIENT_ID!, process.env.GITHUB_CLIENT_SECRET!, process.env.GITHUB_REDIRECT_URL!);
  const spotify = new Spotify(process.env.SPOTIFY_CLIENT_ID!, process.env.SPOTIFY_CLIENT_SECRET!, process.env.SPOTIFY_REDIRECT_URL!);

const oauthTokenRefreshWorker = new Worker('oauth-token-refresh-task', async (job:Job<CredentialRefresh>) => {
  logger.info(`trigger oauth credential refresh`)
  const credential = job.data
  if(credential.schema.credentialType !== 'oauth') {
    return
  }
  let oauth:GitHub|Spotify = github
  switch(credential.schema.platform) {
    case 'github':
      oauth = github;break
    case 'spotify':
      oauth = spotify;break
  }
  logger.info(`refreshing oauth ${credential.id}-${credential.schema.platform}-${credential.schema.schemaVersion}`)
  const res = await oauth.refreshAccessToken(credential.credentialValues['refreshToken'] as string)
  credential.credentialValues['accessToken'] = res.accessToken()
  if(res.hasRefreshToken()) {
    credential.credentialValues['refreshToken'] = res.refreshToken()
  }
  await db.dao.credentialDAO.updateCredential(credential.id, credential.credentialValues,true)
  console.log(job.data);
}, { connection });
const tokenRefreshWorker = new Worker('token-refresh-task', async (job) => {
    logger.info("trigger token refresh task", )
    const needRefresh = await db.dao.credentialDAO.getNeedRefreshCredentials()
    const oauthTask = needRefresh
      .filter(it=>it.schema.credentialType === 'oauth')
    logger.info(`total task count: ${oauthTask.length}`, )
    for (const credential of oauthTask) {
      oauthTokenRefreshQueue.add(`oauth-refresh-${credential.id}`,credential)
    }
    logger.info("trigger token refresh task finished")
  }, { connection });
}