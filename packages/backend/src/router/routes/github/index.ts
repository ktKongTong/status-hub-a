
import {Hono} from "hono";
import {getCurrentCredential} from "@/router/routes";
import {createGitHubAPI} from "@/router/routes/github/github";

interface githubCredential {
  token?: string;
  accessToken?: string;
  username: string
}

const githubRouter = new Hono().basePath('/github')

const convertGitHubEvent = (event: any) => {
  const action = event.payload.action
  let ghType: string = ''
  if(action === 'started') {
    ghType = 'star'
  }

  if(event.type === 'PushEvent' && event.payload.commits) {
    ghType = 'push'
  }

  if(event.type === 'PullRequestEvent' && event.payload.pull_request) {
    ghType = 'pr'
  }

  return {
    id: Math.random().toString(36),
    type: 'github',
    ghType: ghType,
    relateRepo: event.repo.name,
    relateRepoLink: `https://github.com/${event.repo.name}`,
    actor: event.actor.display_login,
    actorLink: `https://github.com/${event.actor.display_login}`,
    avatar: event.actor.avatar_url,
    public: event.public,
    time: event.created_at ? new Date(event.created_at).getTime() : new Date().getTime(),
    payload: event.payload
  }
}

githubRouter.get('/recent', async (c) => {
  const credentialValues = getCurrentCredential<githubCredential>(c)
  const api =  createGitHubAPI(credentialValues.token ?? credentialValues.accessToken!)
  const recentGitHubEvents = await api.getRecentEvent(credentialValues.username, 20)
  return c.json(recentGitHubEvents)
})
githubRouter.get('/activity/recent', async (c) => {
  const credentialValues = getCurrentCredential<githubCredential>(c)
  const api =  createGitHubAPI(credentialValues.token ?? credentialValues.accessToken!)
  const recentGitHubEvents = await api.getRecentEvent(credentialValues.username, 20)
  const  recentGitHubEvent = recentGitHubEvents.map((githubEvent:any) => convertGitHubEvent(githubEvent))
  return c.json(recentGitHubEvent)
})

export default githubRouter