import {Context} from "hono";
import {CredentialType} from "@/interface";
import {createGitHubAPI} from "./github";
import {convertGitHubEvent} from "./utils";
import {getCredentialByPlatformAndType} from "@/router/routes/util";

const handler = async (c:Context) => {
  const credentials = await getCredentialByPlatformAndType(c, 'github', ['apiToken'])
  const credential = credentials[0].credentialValues
  const api =  createGitHubAPI(credential.token as string ?? credential.accessToken!)
  const recentGitHubEvents = await api.getRecentEvent(credential.username as string, 20)
  const  recentGitHubEvent = recentGitHubEvents.map((githubEvent:any) => convertGitHubEvent(githubEvent))
  return c.json(recentGitHubEvent)
}

export const route =  {
  path: '/activity/recent',
  raw: true,
  usableCredentialType: ['apiToken'] as CredentialType[],
  handler: handler
}
