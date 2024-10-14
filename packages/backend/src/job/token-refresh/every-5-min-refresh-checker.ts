import {JobHandler} from "@/job/job-handler";

import {getDB} from "@/middleware/db";
import {logger} from "status-hub-shared/utils";
import {Connection} from "@/job/interface";
import { Job, Queue } from "bullmq";

export class Every5minTokenRefreshCheckerJob extends JobHandler<any> {
  subQueue: Queue
  constructor(conn: Connection, queue: Queue) {
    super('token-refresh-task', conn);
    this.queue.upsertJobScheduler('repeat-every-5min', { every: 60000 * 5}, { name: 'schedule-job', data: {}, opts: {} })
    this.subQueue = queue
  }
  async handler(job: Job<any, any, string>): Promise<any> {
    const db = getDB(undefined as any)
    logger.info("trigger token refresh task")
    const needRefresh = await db.dao.credentialDAO.getNeedRefreshCredentials()
    const oauthTask = needRefresh.filter(it=>it.schema.credentialType === 'oauth')
    logger.info(`total task count: ${oauthTask.length}`, )
    for (const credential of oauthTask) {
      await this.subQueue.add(`oauth-refresh-${credential.id}`, credential)
    }
    logger.info("trigger token refresh task finished")
  }
}