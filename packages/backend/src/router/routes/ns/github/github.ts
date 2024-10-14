// /users/{username}/events
import fetch from "@/utils/fetch";

export const createGitHubAPI = (token: string) => {
    const f = fetch.extend({
      baseURL: 'https://api.github.com/',
      headers: {
        Authorization: `Bearer ${token}`,
        AcceptLanguage: 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
      },
      responseType: 'json'
    })

    async function getRecentEvent(username: string, limit: number = 5) {
      const res = await f.get(`/users/${username}/events?per_page=${limit}&page=1`)
      return res
    }

    async function getUserEmails() {
      return await f.get('/user/emails')
    }
  //   https://api.github.com/user
    async function getUser() {
      return await f.get('/user')
    }

    return {
      getRecentEvent,
      getUser,
      getUserEmails
    }
  
  }