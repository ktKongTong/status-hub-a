import { generateMock } from '@anatine/zod-mock';

import {
  CredentialSchemaInsertSchema, CredentialSchemaSelectItemSchema,
  CredentialSchemaUpdateSchema,
} from "../base";
import {z} from "@hono/zod-openapi";

export const CredentialSchemaOpenAPISchema = CredentialSchemaSelectItemSchema.openapi("CredentialSchemaVOSchema",{
  example: generateMock(CredentialSchemaSelectItemSchema)
})

const CredentialSchemaUpdateOpenApiSchema = CredentialSchemaUpdateSchema
  .openapi('CredentialSchemaUpdateSchema', {
    example: generateMock(CredentialSchemaUpdateSchema)
  })


export type CredentialSchemaUpdate = z.infer<typeof CredentialSchemaUpdateSchema>;
export type CredentialSchemaInsert = z.infer<typeof CredentialSchemaInsertSchema>;
export type CredentialSchemaSelect = z.infer<typeof CredentialSchemaSelectItemSchema>;

export { CredentialSchemaInsertSchema, CredentialSchemaUpdateOpenApiSchema, CredentialSchemaUpdateSchema }