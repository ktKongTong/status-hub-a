import {Context} from "hono";
import {getDB} from "@/middleware/db";
import {getSession} from "@/middleware/auth";
import {buildCredentialValues} from "@/utils/credential";
import {NotFoundError} from "@/errors";
import {CredentialType} from "../../interface";
import { Credential } from "status-hub-shared/models";

export async function getCredential<T>(c:Context, platform: string) {
  const {dao: db} = getDB(c)
  const { user } = getSession(c)
  const credentials = await db.credentialDAO.getCredentialByPlatform(user!.id, platform)
  if (credentials.length === 0) {
    throw new NotFoundError(`No ${platform} credentials found.`)
  }
  const credential = credentials[0]
  const credentialValues = buildCredentialValues<T>(credential.schema.schemaFields, credential.credentialValues)
  return credentialValues
}

//getCredentialByPlatformAndType

export async function getCredentialByPlatformAndType(c:Context, platform: string, supportType: CredentialType[] | undefined): Promise<Credential[]> {
  const {dao: db} = getDB(c)
  const { user } = getSession(c)
  const credentials = await db.credentialDAO.getCredentialByPlatform(user!.id, platform)
  if (credentials.length === 0) {
    throw new NotFoundError(`No ${platform} credentials found.`)
  }
  return credentials
}


export const getCurrentCredential = async <T>(c: Context,platform: string) => {
  // const platform = c.req.param('platform')
  const {dao: db} = getDB(c)
  const { user } = getSession(c)
  const credentials = await db.credentialDAO.getCredentialByPlatform(user!.id, platform)
  if (credentials.length === 0) {
    throw new NotFoundError(`No ${platform} credentials found.`)
  }
  const credential = credentials[0]
  const credentialValues = buildCredentialValues<any>(credential.schema.schemaFields, credential.credentialValues)
  return credentialValues as T
  // return c.get("currentCredentialValue") as T
}
