import {CredentialRefresh} from "status-hub-shared/models/dbo";
import {CredentialStatus, CredentialType} from "status-hub-shared/models";
import {Context} from "hono";



export interface Namespace {
  platform: string
  category: string[]
  supportCredentials: PlatformCredential[]
}

interface CredentialField {
  type: 'string' | 'number' | 'boolean'
  isRequired: boolean
  description: string
}



export type RouteItem<T extends string = string> = {
  path: T;
  raw?: boolean;
  supportCredentialType?: string[];
  handler: (ctx:Context) => Promise<any>
};

export const generateCredentialSchemaAndFieldsFromPlatformCredential = (c : PlatformCredential) => {
  const id = `system-${c.platform}-${c.credentialType}`
  const fields = c.fields

  const credentialFields = Object.keys(fields)
    .map(key => {
      const field = fields[key]
      return {
        schemaId: id,
        schemaVersion: c.version,
        fieldName: key,
        fieldType: field.type,
        isRequired: field.isRequired,
        description: field.description,
      }
    })

  const credentialSchema = {
    id: id,
    platform: c.platform,
    credentialType: c.credentialType,
    schemaVersion: c.version,
    description: c.description,

    autoRefreshable: c.autoRefreshable,
    maximumRefreshIntervalInSec: c.maximumRefreshIntervalInSec ?? 0,
    available: true,
    availablePermissions: c.availablePermissions?.join(",") ?? '',
    permissions: c.permissions?.join(",") ?? '',
    refreshLogic: c.refreshLogic,
    refreshLogicType: 'system' as const,
    schemaFields: credentialFields,
    status: 'ok',
    createdBy: 'system' as const,
  }
  return {
    schema:credentialSchema,
    fields: credentialFields
  }
}

export type SystemSchemaInsert = ReturnType<typeof generateCredentialSchemaAndFieldsFromPlatformCredential>;

// define schema
export interface PlatformCredential {
  platform: string
  version: number
  credentialType: CredentialType;
  autoRefreshable: boolean;
  maximumRefreshIntervalInSec?: number;
  description: string;
  expectExpires?: number;
  refreshLogic?: string;
  availablePermissions?: string[],
  permissions?: string[],
  fields: Record<string, CredentialField>;
}

export type RefreshFunction = (credential: CredentialRefresh, env?:any) => Promise<{
  values: Record<string, string | number | boolean>,
  isActive: boolean,
  status: CredentialStatus,
  ok: boolean,
}>