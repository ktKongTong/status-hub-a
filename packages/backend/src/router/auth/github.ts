import {OAuth2RequestError, generateState, GitHub} from "arctic";
import { getCookie, setCookie } from "hono/cookie";
import { Hono } from "hono";
import {getOAuthProvider, getSession} from "@/middleware/auth";
import {getDB} from "@/middleware/db";
import {UnknownError} from "@/errors";
import {isProd} from "@/utils/env";
import {createGitHubAPI} from "@/router/routes/ns/github/github";
import {createUid} from "@/utils/uid";

type GHEmails = {
  email: string;
  primary: boolean,
  verified: boolean,
}
const getEmails = (emails:GHEmails[])=> {
  return emails.sort((a,b) => {
    if(a.primary) return -1
    if(b.primary) return 1
    if(a.verified) return -1
    return 1
  })[0]
}

export const githubLoginRouter = new Hono().basePath('/api/auth');

githubLoginRouter.get("/login/github", async (c) => {

  const state = generateState();
  const { oauthProvider } = getSession(c)
  const github = oauthProvider['github-oauth'];
  const scope = ["user:email","read:user"]
  const url = github.createAuthorizationURL(state, scope);
  setCookie(c, "github_oauth_state", state, {
    path: "/",
    secure: isProd(c),
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "Lax"
  });
  return c.redirect(url.toString());
});

githubLoginRouter.get("/login/github/callback", async (c) => {
  const { lucia } = getSession(c)
  const github = getOAuthProvider(c, 'github-oauth') as GitHub
  const { dao:db } = getDB(c)
  const code = c.req.query("code") ?? null;
  const state = c.req.query("state") ?? null;
  const storedState = getCookie(c).github_oauth_state ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return c.body(null, 400);
  }
  try {
    const tokens = await github.validateAuthorizationCode(code);
    const accessToken = tokens.accessToken();
    const socpes = tokens.scopes()
    const githubAPI = createGitHubAPI(accessToken)
    const [githubUser, githubUserEmails] = await Promise.all([
      githubAPI.getUser(),
      githubAPI.getUserEmails()
    ])
    const userEmail = getEmails(githubUserEmails).email
    const existingUser = await db.userDAO.getUserByAccountId('github', githubUser.id)
    if (existingUser) {
      const session = await lucia.createSession(existingUser.user.id, {});
      c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), { append: true });
      return c.redirect("/");
    }

    const userId = createUid()
    const data = {
      user: {
        id: userId,
        name: githubUser.name ?? githubUser.login,
        email: githubUser.email ?? userEmail,
        emailVerified: new Date(),
        avatar: githubUser.avatar_url,
      },
      account: {
        userId: userId,
        type: 'oauth' as const,
        provider: 'github' as const,
        providerAccountId: githubUser.id,
        accessToken: accessToken,
        scope: socpes.join(',')
      }
    }
    await db.userDAO.createNewUser(data)
    const session = await lucia.createSession(userId, {});
    c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), { append: true });
    return c.redirect("/")
  } catch (e) {
    if (e instanceof OAuth2RequestError && e.message === "bad_verification_code") {
      // invalid code
      return c.body(null, 400);
    }
    throw new UnknownError();
  }
});

interface GitHubUser {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
  email: string;
}