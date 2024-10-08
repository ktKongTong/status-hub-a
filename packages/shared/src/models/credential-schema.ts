import {z} from "@hono/zod-openapi";
import { generateMock } from '@anatine/zod-mock';
  
export const SchemaFieldSelectSchema = z.object({
    fieldName: z.string(),
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
    platform: z.string(),
    credentialType: z.string(),
    available: z.boolean(),
    permissions: z.string().optional(),
    availablePermissions: z.string().optional(),
    autoRefreshable: z.boolean(),
    refreshLogicType: z.enum(['system', 'script']),
    schemaFields: z.array(CredentialSchemaFieldOpenApiSchema),
})

export const CredentialSchemaUpdateOpenApiSchema = CredentialSchemaUpdateSchema
  .openapi('CredentialSchemaUpdateSchema', {
      example: generateMock(CredentialSchemaUpdateSchema)
  })

export const CredentialSchemaInsertSchema = CredentialSchemaUpdateSchema.omit({ id:true }).merge(z.object({
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
    maximumRefreshIntervalInSec: z.number(),
    // autoRefreshable: integer('auto_refreshable', { mode: 'boolean' }).notNull().default(false),
    // refreshLogicType: text('refresh_logic_type', {enum: ['system', 'script']}).notNull().default('script'),
    // // remove refreshLogic in query
    // refreshLogic: text('refresh_logic'),
    // minimalRefreshIntervalInSec: integer('minimal_refresh_interval_in_sec').notNull().default(0),
    createdBy: z.enum(['system', 'user']),
    createdAt: z.date(),
    updatedAt: z.date(),
    schemaFields: z.array(CredentialSchemaFieldOpenApiSchema)
})

export type CredentialSchemaSelect = z.infer<typeof CredentialSchemaSelectItemSchema>;

export const CredentialSchemaOpenAPISchema = CredentialSchemaSelectItemSchema.openapi("CredentialSchemaVOSchema",{
    example: generateMock(CredentialSchemaSelectItemSchema)
})