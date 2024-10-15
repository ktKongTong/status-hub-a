
import {credentialInsertSchema, credentialSelectSchema, credentialUpdateSchema} from "../base/credential";
import {z} from "@hono/zod-openapi";

export const credentialOpenAPISchema = credentialSelectSchema.openapi("CredentialSelect")

export const credentialInsertOpenAPISchema = credentialInsertSchema.openapi("CredentialInsert")

export const credentialUpdateOpenAPISchema = credentialUpdateSchema.openapi("CredentialUpdate")



export type Credential = z.infer<typeof credentialOpenAPISchema>
export type CredentialInsert = z.infer<typeof credentialInsertSchema>
export type CredentialUpdate = z.infer<typeof credentialUpdateSchema>