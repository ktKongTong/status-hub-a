import {JobHandler} from "@/job/job-handler";
import {CredentialRefresh} from "status-hub-shared/models/dbo";
import {Connection} from "@/job/interface";
import {Job} from "bullmq";
import {getDB} from "@/middleware/db";
import {logger} from "status-hub-shared/utils";

export class UserScriptRefreshJob extends JobHandler<CredentialRefresh> {
  constructor(conn: Connection) {
    super('user-token-refresh-task', conn);
  }
  async handler(job: Job<CredentialRefresh>): Promise<any> {
    const db = getDB("t" as any)
    logger.debug(`trigger user credential refresh`)
    // call credentials that need refresh
    const credential = job.data
    if(credential.schema.refreshType !== 'script') { return }
    // TODO
  }
}