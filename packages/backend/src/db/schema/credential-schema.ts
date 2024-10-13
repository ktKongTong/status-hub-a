
import { sqliteTable, text, integer, primaryKey, foreignKey } from 'drizzle-orm/sqlite-core';

// 系统表
export const credentialSchema = sqliteTable('credential_schema', {
    id: text('id').notNull(),
    schemaVersion: integer('schema_version').notNull().default(1),
    platform: text('platform').notNull(),
    credentialType: text('credential_type').notNull(),
    available: integer('available', { mode: 'boolean' }).notNull().default(true),
    autoRefreshable: integer('auto_refreshable', { mode: 'boolean' }).notNull().default(false),
    refreshLogicType: text('refresh_logic_type', {enum: ['system', 'script']}).notNull().default('script'),
    // remove refreshLogic in query
    description: text('description').notNull().default(""),
    refreshLogic: text('refresh_logic'),
    maximumRefreshIntervalInSec: integer('maximum_refresh_interval_in_sec').notNull().default(0),
    availablePermissions: text('available_permissions').notNull(),
    permissions: text('permissions').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`).$onUpdateFn(() => new Date()),
    status: text('status', { enum: ['ok', 'deleted'] }).notNull().default('ok'),
    createdBy: text('created_by').notNull(),
}, (table) => ({
    pk: primaryKey({ columns: [table.id, table.schemaVersion] }),
}))



// 系统表
export const credentialSchemaFields = sqliteTable('credential_schema_fields', {
    id: integer('id').primaryKey({autoIncrement: true}),
    schemaId: text('schema_id').notNull(),
    schemaVersion: integer('schema_version').notNull(),
    fieldName: text('field_name').notNull(),
    fieldType: text('field_type', { enum: ['string', 'number', 'boolean'] }).notNull(),
    isRequired: integer('is_required', { mode: 'boolean' }).notNull(),
    description: text('description').notNull().default(""),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`).$onUpdateFn(() => new Date()),
}, (table) => ({
    schemaReference: foreignKey({
        columns: [table.schemaId, table.schemaVersion],
        foreignColumns: [credentialSchema.id, credentialSchema.schemaVersion],
    }).onDelete('cascade')
}));


import { z } from 'zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import {sql} from "drizzle-orm";


export const insertCredentialSchemaSchema = createInsertSchema(credentialSchema);
export const selectCredentialSchemaSchema = createSelectSchema(credentialSchema);
export const insertCredentialSchemaFieldsSchema = createInsertSchema(credentialSchemaFields);
export const selectCredentialSchemaFieldsSchema = createSelectSchema(credentialSchemaFields);


export type CredentialSchemaInsert = z.infer<typeof insertCredentialSchemaSchema>;
export type CredentialSchemaSelect = z.infer<typeof selectCredentialSchemaSchema>;
export type CredentialSchemaFieldsInsert = z.infer<typeof insertCredentialSchemaFieldsSchema>;
export type CredentialSchemaFieldsSelect = z.infer<typeof selectCredentialSchemaFieldsSchema>;