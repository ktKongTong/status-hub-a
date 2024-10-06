import {z} from "@hono/zod-openapi";

// export interface Credential {
//   id: number;
//   userId: string;
//   schema: CredentialSchemaSelect;
//   isActive: boolean;
//   createdAt: number;
//   updatedAt: number;
//   credentialValues: {
//     [key in CredentialSchemaSelect['schemaFields'][number]['fieldName']]: string | number | boolean;
//   };
// }

export const credentialSelectSchema = z.object({
  id: z.number(),
  userId: z.string(),
  // CredentialSchemaSelectItemSchema
  // schema: CredentialSchemaSelectItemSchema,
  schema: z.any(),
  isActive: z.boolean(),
  createdAt: z.number(),
  updatedAt: z.number(),
  credentialValues: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean()])
  )
})


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

export type Credential = z.infer<typeof credentialSelectSchema>
//   .refine((data) => {
//   // 验证 credentialValues 的键与 schema 的 schemaFields 匹配
//   const schemaFields = data.schema.schemaFields;
//   const credentialValueKeys = Object.keys(data.credentialValues);
//
//   return schemaFields.every(field =>
//     credentialValueKeys.includes(field.fieldName) &&
//     (field.fieldType === 'string' && typeof data.credentialValues[field.fieldName] === 'string' ||
//      field.fieldType === 'number' && typeof data.credentialValues[field.fieldName] === 'number' ||
//      field.fieldType === 'boolean' && typeof data.credentialValues[field.fieldName] === 'boolean')
//   );
// }, {
//   message: "credentialValues 必须与 schema 的 schemaFields 匹配，并且类型必须正确"
// });

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
export type CredentialInsert = z.infer<typeof credentialInsertSchema>
export type CredentialUpdate = z.infer<typeof credentialUpdateSchema>

export const credentialOpenAPISchema = credentialSelectSchema
  // .openapi("Credential")

export const credentialInsertOpenAPISchema = credentialInsertSchema.openapi("CredentialInsert")

export const credentialUpdateOpenAPISchema = credentialUpdateSchema.openapi("CredentialUpdate")


