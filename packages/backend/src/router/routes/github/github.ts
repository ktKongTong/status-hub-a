// /users/{username}/events
export const createGitHubAPI = (token: string) => {
    async function fetchWebApi(endpoint: string, method: string, body?: any) {
      const res = await fetch(`https://api.github.com${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          AcceptLanguage: 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        },
        method,
        body:JSON.stringify(body)
      });
      return await res.json();
    }
  
    async function getRecentEvent(username: string, limit: number = 5) {
      const res =  (await fetchWebApi(`/users/${username}/events?per_page=${limit}&page=1`, 'GET'))
      return res as any
    }

    async function getUser() {
    //   https://api.github.com/user
      return await fetchWebApi(`/user`, 'GET')
    }

    return {
      getRecentEvent,
      getUser
    }
  
  }