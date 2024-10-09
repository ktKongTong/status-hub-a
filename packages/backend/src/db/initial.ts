import {SystemSchemaInsert} from "@/interface";
import {db} from "@/middleware/db";
import {credentialSchema, credentialSchemaFields} from "./schema";
import {and, eq, getTableColumns, SQL, sql} from "drizzle-orm";
import {SQLiteTable} from "drizzle-orm/sqlite-core";

export const initSystemSchemas = async (schemas:SystemSchemaInsert[]) => {
  for await (const schema of schemas) {
    await initSystemSchema(schema)
  }
}

const initSystemSchema = async (sysSchema: SystemSchemaInsert) => {
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
      set: buildConflictUpdateColumns(credentialSchema, ['available', 'autoRefreshable','updatedAt', 'availablePermissions', 'permissions','maximumRefreshIntervalInSec', 'refreshLogicType', 'refreshLogic']),
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
