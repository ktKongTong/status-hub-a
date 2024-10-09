import {Context} from "hono";
import {getCredentialByPlatformAndType} from "../../util";
import {CredentialType} from "../../../../interface";
import {createGitHubAPI} from "./github";
import {convertGitHubEvent} from "./utils";

const handler = async (c:Context) => {
  const credentials = await getCredentialByPlatformAndType(c, 'github', ['apiToken'])
  const credential = credentials[0].credentialValues
  const api =  createGitHubAPI(credential.token ?? credential.accessToken!)
  const recentGitHubEvents = await api.getRecentEvent(credential.username, 20)
  const  recentGitHubEvent = recentGitHubEvents.map((githubEvent:any) => convertGitHubEvent(githubEvent))
  return c.json(recentGitHubEvent)
}

export const githubRecentActivityRoute =  {
  path: '/activity/recent',
  raw: true,
  usableCredentialType: ['apiToken'] as CredentialType[],
  handler: handler
}
