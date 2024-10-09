
export const convertGitHubEvent = (event: any) => {
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
