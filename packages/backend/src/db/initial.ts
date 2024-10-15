import {SystemSchemaInsert} from "@/types";
import {credentialSchema, credentialSchemaFields} from "./schema";
import {and, eq, getTableColumns, SQL, sql} from "drizzle-orm";
import {SQLiteTable} from "drizzle-orm/sqlite-core";
import {BetterSQLite3Database} from "drizzle-orm/better-sqlite3";

export const initSystemSchemas = async (db:BetterSQLite3Database,schemas:SystemSchemaInsert[]) => {
  for await (const schema of schemas) {
    await initSystemSchema(db, schema)
  }
}

const initSystemSchema = async (db:BetterSQLite3Database, sysSchema: SystemSchemaInsert) => {
  await db.transaction(async tx => {
    // schema.schema.
    const schema = sysSchema.schema
    const fields = sysSchema.fields

    const v = {
      id: schema.id,
      schemaVersion: schema.schemaVersion,
      platform: schema.platform,
      credentialType: schema.credentialType,
      available: schema.available,
      autoRefreshable: schema.autoRefreshable,
      refreshLogicType: schema.refreshLogicType ,
      description: schema.description,
      refreshLogic: '',
      maximumRefreshIntervalInSec: schema.maximumRefreshIntervalInSec,
      availablePermissions: schema.availablePermissions,
      permissions: schema.permissions,
      createdBy: 'system' as const,
      status: 'ok' as const,
    }
    await tx.insert(credentialSchema).values(v)
      .onConflictDoUpdate({
      target: [credentialSchema.schemaVersion, credentialSchema.id],
      set: buildConflictUpdateColumns(credentialSchema, ['available', 'autoRefreshable','updatedAt', 'availablePermissions', 'permissions','maximumRefreshIntervalInSec', 'refreshLogicType', 'refreshLogic', 'description']),
    }).execute()
    await tx.delete(credentialSchemaFields).where(and(eq(credentialSchemaFields.schemaId, schema.id),eq(credentialSchemaFields.schemaVersion, schema.schemaVersion)))
      .execute()
    await tx.insert(credentialSchemaFields).values(fields)
      .execute()
  }).catch(e => console.error(e));
}

const buildConflictUpdateColumns = <
  T extends  SQLiteTable,
  Q extends keyof T['_']['columns']
>(
  table: T,
  columns: Q[],
) => {
  const cls = getTableColumns(table);
  return columns.reduce((acc, column) => {
    const colName = cls[column].name;
    acc[column] = sql.raw(`excluded.${colName}`);
    return acc;
  }, {} as Record<Q, SQL>);
};
