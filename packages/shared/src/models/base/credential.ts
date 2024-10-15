import {z} from "@hono/zod-openapi";
import {CredentialSchemaSelectItemSchema} from "../base";


export const credentialInsertSchema = z.object({
  schemaId: z.string(),
  schemaVersion: z.number().min(1),
  credentialValues: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean()])
  )
})

export const credentialUpdateSchema = z.object({
  id: z.number(),
  isActive: z.boolean(),
  credentialValues: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean()])
  )
})

export const credentialSelectSchema = z.object({
  id: z.number(),
  userId: z.string(),
  schema: CredentialSchemaSelectItemSchema,
  isActive: z.boolean(),
  createdAt: z.number(),
  updatedAt: z.number(),
  credentialValues: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean()])
  )
})