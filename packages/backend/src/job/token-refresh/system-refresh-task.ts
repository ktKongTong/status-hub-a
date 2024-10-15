import {JobHandler} from "@/job/job-handler";
import {Connection} from "@/job/interface";
import {Job} from "bullmq";
import {getDB} from "@/middleware/db";
import {logger} from "status-hub-shared/utils";
import {RefreshFunction} from "@/types";
import {CredentialRefresh} from "status-hub-shared/models/dbo";
import {credentialRefreshFuncs} from "@/route-registry";


const getRefreshFuncByPlatformAndCredentialSchema =
  (platform: string, credentialType: string, version: number):RefreshFunction => {
  return credentialRefreshFuncs[`system-${platform}-${credentialType}`]
}

export class SystemRefreshTask extends JobHandler<CredentialRefresh> {
  constructor(conn: Connection) {
    super('system-schema-token-refresh-task', conn);
  }

  async handler(job: Job<CredentialRefresh>): Promise<any> {
    const db = getDB("t" as any)
    logger.debug(`trigger system credential refresh task`)
    const credential = job.data
    if(credential.schema.createdBy !== 'system') { return }

    const handler = getRefreshFuncByPlatformAndCredentialSchema(credential.schema.platform, credential.schema.credentialType, credential.schema.schemaVersion)

    if(!handler) {
      return
    }

    logger.debug(`refreshing ${credential.id}`)
    const res = await handler(credential)
    if(res.ok) {
      logger.debug(`refreshed ${credential.id}`)
      await db.dao.credentialDAO.refreshCredential(credential.id, res.values, true)
    }else {

    }
  }
}