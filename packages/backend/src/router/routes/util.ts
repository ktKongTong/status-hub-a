import {Context} from "hono";
import {getDB} from "@/middleware/db";
import {getSession} from "@/middleware/auth";
import {NotFoundError} from "@/errors";
import {SchemaField, Credential} from "status-hub-shared/models/dbo";
import {CredentialType} from "status-hub-shared/models";

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
  let credentials:Credential[] = []
  if(supportType) {
    credentials = await db.credentialDAO.getCredentialByPlatformAndType(user!.id, platform, supportType)
  }else {
    credentials = await db.credentialDAO.getCredentialByPlatform(user!.id, platform)
  }
  if (credentials.length === 0) {
    throw new NotFoundError(`${platform} credentials not found.`)
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


export function buildCredentialValues<T>(schema: SchemaField[], values: Record<string, any>): T {
  // todo Credential['credentialValues']
  const result: any = {};
  schema.forEach(field => {
    const value = values[field.fieldName];
    switch (field.fieldType) {
      case 'string':
        result[field.fieldName] = String(value);
        break;
      case 'number':
        result[field.fieldName] = Number(value);
        break;
      case 'boolean':
        result[field.fieldName] = Boolean(value);
        break;
      default:
        result[field.fieldName] = value;
    }
  });
  return result as T;
}