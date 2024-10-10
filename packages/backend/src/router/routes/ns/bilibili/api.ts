
import fetch from "@/utils/fetch";

export const createBilibiliAPI = (sessdata: string) => {
  const f = fetch.extend({
    baseURL: 'https://api.bilibili.com',
    headers: {
      Cookie: `SESSDATA=${sessdata}`,
      AcceptLanguage: 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    },
    redirect: 'follow',
    responseType: 'json'
  })

  async function getHistory() {
    const res = await f.get(`/x/web-interface/history/cursor`)
    return res
  }

  return {
    getHistory,
  }

}