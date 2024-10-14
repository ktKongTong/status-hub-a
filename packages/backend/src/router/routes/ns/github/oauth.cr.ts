import {RefreshFunction} from "@/types";
import {CredentialRefresh} from "status-hub-shared/models";
import { GitHub } from "arctic";

export const refreshFunc : RefreshFunction = async (credential: CredentialRefresh, env?:any)=> {
  const github = new GitHub(process.env.GITHUB_CLIENT_ID!, process.env.GITHUB_CLIENT_SECRET!, process.env.GITHUB_REDIRECT_URL!);
  const res = await github.refreshAccessToken(credential.credentialValues['refreshToken'] as string)
  credential.credentialValues['accessToken'] = res.accessToken()
  if(res.hasRefreshToken()) {
    credential.credentialValues['refreshToken'] = res.refreshToken()
  }
  return {
    values: credential.credentialValues,
    isActive: true,
    status: 'ok',
    ok: true
  }
}