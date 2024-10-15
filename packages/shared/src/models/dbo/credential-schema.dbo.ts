import {z} from "@hono/zod-openapi";
import {
  CredentialSchemaInsertSchema, CredentialSchemaSelectItemSchema,
  CredentialSchemaUpdateSchema,
  SchemaFieldSelectSchema
} from "../base";

export type CredentialSchemaUpdate = z.infer<typeof CredentialSchemaUpdateSchema>;
export type CredentialSchemaInsert = z.infer<typeof CredentialSchemaInsertSchema>;
export type CredentialSchemaSelect = z.infer<typeof CredentialSchemaSelectItemSchema>;
export type SchemaField = z.infer<typeof SchemaFieldSelectSchema>
