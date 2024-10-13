import {z} from "@hono/zod-openapi";
import { generateMock } from '@anatine/zod-mock';
  
export const SchemaFieldSelectSchema = z.object({
    fieldName: z.string().min(1, {message:'字段名称不可为空'}),
    fieldType: z.enum(['string', 'number' , 'boolean']),
    isRequired: z.boolean(),
    description: z.string(),
  })

export type SchemaField = z.infer<typeof SchemaFieldSelectSchema>

export const CredentialSchemaFieldOpenApiSchema = SchemaFieldSelectSchema
  .openapi('SchemaFieldSelectSchema', {
      example: generateMock(SchemaFieldSelectSchema)
  })

export const CredentialSchemaUpdateSchema = z.object({
    id: z.string(),
    platform: z.string().max(10).regex(/^[a-zA-Z0-9_-]+$/, {message : '仅可包含字母、数字、\'_\'以及\'-\''}),
    credentialType: z.string().max(10).regex(/^[a-zA-Z0-9_-]+$/, {message : '仅可包含字母、数字、\'_\'以及\'-\''}),
    autoRefreshable: z.boolean().default(false),
    description: z.string(),
    maximumRefreshIntervalInSec: z.number().default(3600).refine((val) => {
        return val == 0 || val >= 3600
    }, { message: "刷新间隔最少为 1h（仅当自动刷新不可用时可为0）" }),
    available: z.boolean(),
    permissions: z.string().optional(),
    availablePermissions: z.string().optional(),
    schemaFields: z.array(CredentialSchemaFieldOpenApiSchema).min(1, {
        message: "至少需要一个字段"
    }),
})

export const CredentialSchemaUpdateOpenApiSchema = CredentialSchemaUpdateSchema
  .openapi('CredentialSchemaUpdateSchema', {
      example: generateMock(CredentialSchemaUpdateSchema)
  })

export const CredentialSchemaInsertSchema = CredentialSchemaUpdateSchema
  .omit({ id:true })
  .merge(z.object({
    permissions: z.string(),
    availablePermissions: z.string(),
}))

export type CredentialSchemaUpdate = z.infer<typeof CredentialSchemaUpdateSchema>;
export type CredentialSchemaInsert = z.infer<typeof CredentialSchemaInsertSchema>;

export const CredentialSchemaSelectItemSchema = z.object({
    id: z.string(),
    platform: z.string(),
    credentialType: z.string(),
    schemaVersion: z.number(),
    available: z.boolean(),
    permissions: z.string(),
    availablePermissions: z.string(),
    autoRefreshable: z.boolean(),
    refreshLogicType: z.enum(['system', 'script']).default('system'),
    refreshLogic: z.string().optional().nullish(),
    description: z.string().default(''),
    maximumRefreshIntervalInSec: z.number(),
    createdBy: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    schemaFields: z.array(CredentialSchemaFieldOpenApiSchema)
})

export type CredentialSchemaSelect = z.infer<typeof CredentialSchemaSelectItemSchema>;

export const CredentialSchemaOpenAPISchema = CredentialSchemaSelectItemSchema.openapi("CredentialSchemaVOSchema",{
    example: generateMock(CredentialSchemaSelectItemSchema)
})