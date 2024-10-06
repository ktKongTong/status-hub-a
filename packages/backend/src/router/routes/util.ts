import {Context} from "hono";
import {getDB} from "@/middleware/db";
import {getSession} from "@/middleware/auth";
import {buildCredentialValues} from "@/utils/credential";
import {NotFoundError} from "@/errors";

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