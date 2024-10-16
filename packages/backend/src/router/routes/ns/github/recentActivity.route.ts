import {Context} from "hono";
import {createGitHubAPI} from "./github";
import {convertGitHubEvent} from "./utils";
import {getCredentialByPlatformAndType} from "@/router/routes/util";
import {CredentialType} from "status-hub-shared/models";

const handler = async (c:Context) => {
  const credentials = await getCredentialByPlatformAndType(c, 'github', ['api-token'])
  const credential = credentials[0].credentialValues
  const api =  createGitHubAPI(credential.token as string ?? credential.accessToken!)
  const recentGitHubEvents = await api.getRecentEvent(credential.username as string, 20)
  const  recentGitHubEvent = recentGitHubEvents.map((githubEvent:any) => convertGitHubEvent(githubEvent))
  return c.json(recentGitHubEvent)
}

export const route =  {
  path: '/activity/recent',
  raw: true,
  supportCredentialType: ['api-token'] as CredentialType[],
  handler: handler
}
