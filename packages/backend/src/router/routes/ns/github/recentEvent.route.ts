import {Context} from "hono";
import {CredentialType} from "@/interface";
import {createGitHubAPI} from "./github";

const handler = async (c:Context) => {
  const {getCredentialByPlatformAndType} = await import('../../util')
  const credentials = await getCredentialByPlatformAndType(c, 'github', ['apiToken'])
  const credential = credentials[0].credentialValues
  const api =  createGitHubAPI(credential.token ?? credential.accessToken!)
  const recentGitHubEvents = await api.getRecentEvent(credential.username, 20)
  return c.json(recentGitHubEvents)
}

export const route =  {
  path: '/recent',
  raw: true,
  usableCredentialType: ['apiToken'] as CredentialType[],
  handler: handler
}
