import {Hono} from "hono";
import {getOAuthProvider, getOAuthProviderScope, isSupportOAuthPlatform, OauthAdapterKey} from "@/middleware/auth";
import {getCookie, setCookie} from "hono/cookie";
import { isProd } from "@/utils/env";

const app = new Hono()

app.get('/oauth/adapter/:platform', async (c) => {
  const state = crypto.randomUUID()
  const platform = c.req.param("platform") as OauthAdapterKey
  const s = getOAuthProvider(c, platform)
  const scopes = getOAuthProviderScope(c, platform)
  const url = s.createAuthorizationURL(state, scopes)
  setCookie(c, `${platform}_oauth_state`, state, {
    path: "/",
    secure: isProd(c),
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "Lax"
  });
  return c.redirect(url.toString());
})

app.get('/adapter/:platform/callback', async (c) => {
  const platform = c.req.param("platform") as OauthAdapterKey
  if(!isSupportOAuthPlatform(c, platform)) {
    return c.body(null, 400);
  }
  const s = getOAuthProvider(c, platform)
  const code = c.req.query("code") ?? null;
  const state = c.req.query("state") ?? null;
  const storedState = getCookie(c)[`${platform}_oauth_state`] ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return c.body(null, 400);
  }
  const tokens = await s.validateAuthorizationCode(code!);
  var result: Record<string, string> = {}
  try {
    result["accessToken"] = tokens.accessToken();
  }catch (e) {}
  try {
    result["tokenType"] = tokens.tokenType();
  }catch (e) {}
  try {
    result["tokenType"] = tokens.tokenType();
  }catch (e) {}
  if(tokens.hasRefreshToken()) {
    result["refreshToken"] = tokens.refreshToken();
  }
  if(tokens.hasScopes()) {
    result["scopes"] = tokens.scopes().join(',')
  }else {
    result["scopes"] = getOAuthProviderScope(c, platform).join(',')
  }
  const param = btoa(JSON.stringify(result))
  return c.redirect(`/receiver-adapter/${platform}?code=` + param)
})


export default app