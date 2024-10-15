import {z} from "@hono/zod-openapi";
import {credentialInsertSchema, credentialUpdateSchema} from "../base";
import {credentialOpenAPISchema} from "@/models/vo";

export const credentialRefreshSelectSchema = z.object({
  id: z.number(),
  userId: z.string(),
  schema: z.any(),
  isActive: z.boolean(),
  createdAt: z.number(),
  updatedAt: z.number(),
  lastRefreshedAt: z.number(),
  maximumRefreshIntervalInSec: z.number(),
  credentialValues: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean()])
  )
})

export type CredentialRefresh = z.infer<typeof credentialRefreshSelectSchema>

export type Credential = z.infer<typeof credentialOpenAPISchema>
export type CredentialInsert = z.infer<typeof credentialInsertSchema>
export type CredentialUpdate = z.infer<typeof credentialUpdateSchema>