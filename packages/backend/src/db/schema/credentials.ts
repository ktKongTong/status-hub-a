
import {sqliteTable, text, integer, foreignKey, blob} from 'drizzle-orm/sqlite-core';
import { users } from './users';
import { credentialSchema } from './credential-schema';
import {sql} from "drizzle-orm";


export const platformCredentials = sqliteTable('platform_credentials', {
    id: integer('id').primaryKey({autoIncrement: true}),
    userId: text('user_id').notNull().references(() => users.id),
    schemaId: text('schema_id').notNull(),
    schemaVersion: integer('schema_version').notNull(),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    credentialValues: blob('credential_values', { mode: 'json' }).notNull(),
    maximumRefreshIntervalInSec: integer('maximum_refresh_interval_in_sec').notNull().default(0),
    lastRefreshedAt: integer('last_refreshed_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    // // 预期有效期
    expectExpires: integer('expect_expires', {mode: 'number'}).notNull().default(0),
    status: text('status', {enum: ['invalid','pending', 'ok']}).notNull().default('ok'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`).$onUpdateFn(() => new Date()),
},(table) => ({
    schemaReference: foreignKey({
        columns: [table.schemaId, table.schemaVersion],
        foreignColumns: [credentialSchema.id, credentialSchema.schemaVersion],
    }).onDelete('cascade')
}))
