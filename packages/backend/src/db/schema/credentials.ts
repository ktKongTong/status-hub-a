
import {sqliteTable, text, integer, foreignKey, blob} from 'drizzle-orm/sqlite-core';
import { users } from './users';
import { credentialSchema } from './credential-schema';
import {sql} from "drizzle-orm";
import {CredentialStatusArr} from "@/types";

const credentialStatusEnum = CredentialStatusArr as readonly [string, ...string[]]


export const platformCredentials = sqliteTable('platform_credentials', {
    id: integer('id').primaryKey({autoIncrement: true}),
    userId: text('user_id').notNull().references(() => users.id),
    schemaId: text('schema_id').notNull(),
    schemaVersion: integer('schema_version').notNull(),
    credentialValues: blob('credential_values', { mode: 'json' }).notNull(),
    maximumRefreshIntervalInSec: integer('maximum_refresh_interval_in_sec').notNull().default(0),
    lastRefreshedAt: integer('last_refreshed_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    expectExpires: integer('expect_expires').notNull().default(0),
    status: text('status', {enum: credentialStatusEnum}).notNull().default('ok'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`).$onUpdateFn(() => new Date()),
},(table) => ({
    schemaReference: foreignKey({
        columns: [table.schemaId, table.schemaVersion],
        foreignColumns: [credentialSchema.id, credentialSchema.schemaVersion],
    }).onDelete('cascade')
}))
