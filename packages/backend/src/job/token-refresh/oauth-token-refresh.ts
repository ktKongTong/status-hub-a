import {JobHandler} from "@/job/job-handler";
import {Job} from "bullmq";
import {getDB} from "@/middleware/db";
import {GitHub, Spotify} from "arctic";

import {CredentialRefresh} from "status-hub-shared/models/dbo";

import {logger} from "status-hub-shared/utils";
import {Connection} from "@/job/interface";

export class SystemOAuthTokenJob extends JobHandler<CredentialRefresh> {
  constructor(conn: Connection) {
    super('oauth-token-refresh-task', conn);
  }
  async handler(job: Job<CredentialRefresh>): Promise<any> {
    const db = getDB("t" as any)
    const github = new GitHub(process.env.GITHUB_CLIENT_ID!, process.env.GITHUB_CLIENT_SECRET!, process.env.GITHUB_REDIRECT_URL!);
    const spotify = new Spotify(process.env.SPOTIFY_CLIENT_ID!, process.env.SPOTIFY_CLIENT_SECRET!, process.env.SPOTIFY_REDIRECT_URL!);
    logger.debug(`trigger oauth credential refresh`)
    const credential = job.data
    if(credential.schema.credentialType !== 'oauth') { return }
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
  }
}