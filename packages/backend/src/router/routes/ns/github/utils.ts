import {timestamp} from "status-hub-shared/utils";

export const convertGitHubEvent = (event: any) => {
  const action = event.payload.action
  let ghType: string = ''
  if(action === 'started' && event.type === 'WatchEvent') {
    ghType = 'star'
  }

  if(event.type === 'CreateEvent' && event.payload.ref_type ==="tag") {
    ghType = 'tag'
  }

  if(event.type === 'PushEvent' && event.payload.commits) {
    ghType = 'push'
  }

  if(event.type === 'PullRequestEvent' && event.payload.pull_request) {
    ghType = 'pr'
  }

  return {
    id: event.id,
    type: 'github',
    ghType: ghType,
    relateRepo: event.repo.name,
    relateRepoLink: `https://github.com/${event.repo.name}`,
    actor: event.actor.display_login,
    actorLink: `https://github.com/${event.actor.display_login}`,
    avatar: event.actor.avatar_url,
    public: event.public,
    time: timestamp(event.created_at),
    payload: event.payload
  }
}
