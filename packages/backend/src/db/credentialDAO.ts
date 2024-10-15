import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as tables from './schema';
import {eq, and, sql, inArray} from "drizzle-orm";
import {Credential, CredentialRefresh, SchemaField} from "status-hub-shared/models/dbo";
import {DBError} from "@/errors";
import {CredentialType} from "status-hub-shared/models";

export interface ICredentialDAO {
  addCredential(userId: string, schemaId: string, schemaVersion: number, credentialValues: Record<string, string | number | boolean>): Promise<void>;
  getCredentialByPlatform(userId: string, platform: string): Promise<Credential[]>
  getCredentialByPlatformAndType(userId: string, platform: string, type: CredentialType[]): Promise<Credential[]>
  getNeedRefreshCredentials(): Promise<CredentialRefresh[]>
  getCredential(userId: string): Promise<Credential[]>;
  updateCredential(credentialId: number, credentialValues: Record<string, string | number | boolean>, refresh?: boolean): Promise<void>
  refreshCredential(credentialId: number, credentialValues: Record<string, string | number | boolean>, refresh?: boolean): Promise<void>
  deleteCredential(credentialId: number): Promise<void>
}

export class CredentialDAO implements ICredentialDAO {
  constructor(private db: BetterSQLite3Database) {}

  async getNeedRefreshCredentials(): Promise<CredentialRefresh[]> {
    const query =  this.db.select({
      userId: tables.platformCredentials.userId,
      id: tables.platformCredentials.id,
      platform: tables.credentialSchema.platform,
      credentialType: tables.credentialSchema.credentialType,
      schemaVersion: tables.credentialSchema.schemaVersion,
      isActive: tables.platformCredentials.isActive,
      createdAt: tables.platformCredentials.createdAt,
      updatedAt: tables.platformCredentials.updatedAt,
      schemaCreatedAt: tables.credentialSchema.createdAt,
      schemaUpdatedAt: tables.credentialSchema.updatedAt,
      createdBy: tables.credentialSchema.createdBy,
      schemaFields: sql<string>`json_group_array(DISTINCT json_object('fieldName', ${tables.credentialSchemaFields.fieldName}, 'fieldType', ${tables.credentialSchemaFields.fieldType}, 'isRequired', ${tables.credentialSchemaFields.isRequired}, 'description', ${tables.credentialSchemaFields.description}, 'createdAt', ${tables.credentialSchemaFields.createdAt}, 'updatedAt', ${tables.credentialSchemaFields.updatedAt}))`,
      credentialValues: tables.platformCredentials.credentialValues,
      lastRefreshedAt: tables.platformCredentials.lastRefreshedAt,
      maximumRefreshIntervalInSec: tables.platformCredentials.maximumRefreshIntervalInSec
    })
      .from(tables.platformCredentials)
      .innerJoin(tables.credentialSchema,
        and(
          eq(tables.platformCredentials.schemaId, tables.credentialSchema.id),
          eq(tables.platformCredentials.schemaVersion, tables.credentialSchema.schemaVersion),
          eq(tables.credentialSchema.autoRefreshable, true)
        )
      )
      .leftJoin(tables.credentialSchemaFields, and(
        eq(tables.credentialSchema.id, tables.credentialSchemaFields.schemaId),
        eq(tables.credentialSchema.schemaVersion, tables.credentialSchemaFields.schemaVersion),
      ))
      .where(
        sql`${tables.platformCredentials.lastRefreshedAt} + ${tables.platformCredentials.maximumRefreshIntervalInSec} + 300 < unixepoch()`
      )
      .groupBy(tables.platformCredentials.id);

    const result = await query.execute()
    return result.map((row:any) => ({
      userId: row.userId,
      id: row.id,
      schema: {
        id: row.schemaId,
        platform: row.platform,
        credentialType: row.credentialType,
        schemaVersion: row.schemaVersion,
        available: row.available,
        permissions: row.permissions,
        createdBy: row.createdBy,
        availablePermissions: row.availablePermissions,
        createdAt: row.schemaCreatedAt,
        updatedAt: row.schemaUpdatedAt,
        schemaFields: JSON.parse(row.schemaFields).reduce((acc: Array<SchemaField>, field: SchemaField) => {
          acc.push(field)
          return acc;
        }, []),
      },
      lastRefreshedAt: row.lastRefreshedAt,
      maximumRefreshIntervalInSec: row.maximumRefreshIntervalInSec,
      isActive: Boolean(row.isActive),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      credentialValues: row.credentialValues
    }));
    }

  async addCredential(userId: string, schemaId: string, schemaVersion: number, credentialValues: Record<string, string | number | boolean>): Promise<void> {
    await this.db.transaction(async (tx) => {
      const credentialSchema = await tx.select()
        .from(tables.credentialSchema)
        .where(and(
          eq(tables.credentialSchema.id, schemaId),
          eq(tables.credentialSchema.schemaVersion, schemaVersion),
        ));
      if (credentialSchema.length === 0) {
        throw new DBError('Credential schema not found');
      }
      await this.db.insert(tables.platformCredentials).values({
        userId: userId,
        schemaId: schemaId,
        schemaVersion: schemaVersion,
        credentialValues: credentialValues,
      });
    })

  }

  async getCredential(userId: string): Promise<Credential[]> {
    const query =  this.db.select({
      userId: tables.platformCredentials.userId,
      id: tables.platformCredentials.id,
      isActive: tables.platformCredentials.isActive,
      createdAt: tables.platformCredentials.createdAt,
      updatedAt: tables.platformCredentials.updatedAt,
      schema: tables.credentialSchema,
      schemaFields: sql<string>`json_group_array(DISTINCT json_object('fieldName', ${tables.credentialSchemaFields.fieldName}, 'fieldType', ${tables.credentialSchemaFields.fieldType}, 'isRequired', ${tables.credentialSchemaFields.isRequired}, 'description', ${tables.credentialSchemaFields.description}, 'createdAt', ${tables.credentialSchemaFields.createdAt}, 'updatedAt', ${tables.credentialSchemaFields.updatedAt}))`,
      credentialValues: tables.platformCredentials.credentialValues,
    })
    .from(tables.platformCredentials)
    .innerJoin(tables.credentialSchema, 
      and(
        eq(tables.platformCredentials.schemaId, tables.credentialSchema.id),
        eq(tables.platformCredentials.schemaVersion, tables.credentialSchema.schemaVersion)
      )
    )
    .leftJoin(tables.credentialSchemaFields, and(
      eq(tables.credentialSchema.id, tables.credentialSchemaFields.schemaId),
      eq(tables.credentialSchema.schemaVersion, tables.credentialSchemaFields.schemaVersion)
    ))
    .where(eq(tables.platformCredentials.userId, userId))
    .groupBy(tables.platformCredentials.id);
    const s = query.toSQL().sql;
    const result = await query.execute();
    return result.map((row:any) => ({
      userId: row.userId,
      id: row.id,
      schema: {
        ...row.schema,
        schemaFields: JSON.parse(row.schemaFields).reduce((acc: Array<SchemaField>, field: SchemaField) => {
          acc.push(field)
          return acc;
        }, [])
      },
      isActive: Boolean(row.isActive),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      credentialValues: row.credentialValues
    }));
  }

  async getCredentialByPlatform(userId: string, platform: string): Promise<Credential[]> {
    const result = await this.db.select({
      userId: tables.platformCredentials.userId,
      id: tables.platformCredentials.id,
      isActive: tables.platformCredentials.isActive,
      createdAt: tables.platformCredentials.createdAt,
      updatedAt: tables.platformCredentials.updatedAt,
      schema: tables.credentialSchema,
      schemaFields: sql<string>`json_group_array(DISTINCT json_object('fieldName', ${tables.credentialSchemaFields.fieldName}, 'fieldType', ${tables.credentialSchemaFields.fieldType}, 'isRequired', ${tables.credentialSchemaFields.isRequired}, 'description', ${tables.credentialSchemaFields.description}, 'createdAt', ${tables.credentialSchemaFields.createdAt}, 'updatedAt', ${tables.credentialSchemaFields.updatedAt}))`,
      credentialValues: tables.platformCredentials.credentialValues,
    })
    .from(tables.platformCredentials)
    .innerJoin(tables.credentialSchema, 
      and(
        eq(tables.platformCredentials.schemaId, tables.credentialSchema.id),
        eq(tables.platformCredentials.schemaVersion, tables.credentialSchema.schemaVersion)
      )
    )
    .leftJoin(tables.credentialSchemaFields, and(
      eq(tables.credentialSchema.id, tables.credentialSchemaFields.schemaId),
      eq(tables.credentialSchema.schemaVersion, tables.credentialSchemaFields.schemaVersion)
    ))
    .where(and(
      eq(tables.platformCredentials.userId, userId),
      eq(tables.credentialSchema.platform, platform)
    ))
    .groupBy(tables.platformCredentials.id);
  
    return result.map((row:any) => ({
      userId: row.userId,
      id: row.id,
      schema: {
        ...row.schema,
        schemaFields: JSON.parse(row.schemaFields).reduce((acc: Array<SchemaField>, field: SchemaField) => {
          acc.push(field)
          return acc;
        }, [])
      },
      isActive: Boolean(row.isActive),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      credentialValues: row.credentialValues
    }));
  };

  async updateCredential(credentialId: number, credentialValues: Record<string, string>, refresh: boolean = false): Promise<void> {

    const now =  new Date();
    if(refresh) {
      await this.db.update(tables.platformCredentials)
        .set({
          credentialValues: credentialValues,
          updatedAt: now,
          lastRefreshedAt: now
        })
        .where(eq(tables.platformCredentials.id, credentialId));
    }else {
      await this.db.update(tables.platformCredentials)
        .set({
          credentialValues: credentialValues,
          updatedAt: now
        })
        .where(eq(tables.platformCredentials.id, credentialId));
    }

  }

  async refreshCredential(credentialId: number, credentialValues: any, refresh: boolean = false): Promise<void> {
    const now =  new Date();
    if(refresh) {
      await this.db.update(tables.platformCredentials)
        .set({
          credentialValues: credentialValues,
          updatedAt: now,
          lastRefreshedAt: now
        })
        .where(eq(tables.platformCredentials.id, credentialId));
    }else {
      await this.db.update(tables.platformCredentials)
        .set({
          credentialValues: credentialValues,
          updatedAt: now
        })
        .where(eq(tables.platformCredentials.id, credentialId));
    }
  }

  async deleteCredential(credentialId: number): Promise<void> {
    await this.db.delete(tables.platformCredentials)
      .where(eq(tables.platformCredentials.id, credentialId));
  }

  async getCredentialByPlatformAndType(userId: string, platform: string, types: CredentialType[]): Promise<Credential[]> {
    const result = await this.db.select({
      userId: tables.platformCredentials.userId,
      id: tables.platformCredentials.id,
      isActive: tables.platformCredentials.isActive,
      createdAt: tables.platformCredentials.createdAt,
      updatedAt: tables.platformCredentials.updatedAt,
      schema: tables.credentialSchema,
      schemaFields: sql<string>`json_group_array(DISTINCT json_object('fieldName', ${tables.credentialSchemaFields.fieldName}, 'fieldType', ${tables.credentialSchemaFields.fieldType}, 'isRequired', ${tables.credentialSchemaFields.isRequired}, 'description', ${tables.credentialSchemaFields.description}, 'createdAt', ${tables.credentialSchemaFields.createdAt}, 'updatedAt', ${tables.credentialSchemaFields.updatedAt}))`,
      credentialValues: tables.platformCredentials.credentialValues,
    })
      .from(tables.platformCredentials)
      .innerJoin(tables.credentialSchema,
        and(
          eq(tables.platformCredentials.schemaId, tables.credentialSchema.id),
          eq(tables.platformCredentials.schemaVersion, tables.credentialSchema.schemaVersion)
        )
      )
      .leftJoin(tables.credentialSchemaFields, and(
        eq(tables.credentialSchema.id, tables.credentialSchemaFields.schemaId),
        eq(tables.credentialSchema.schemaVersion, tables.credentialSchemaFields.schemaVersion)
      ))
      .where(and(
        eq(tables.platformCredentials.userId, userId),
        inArray(tables.credentialSchema.credentialType, types),
        eq(tables.credentialSchema.platform, platform)
      ))
      .groupBy(tables.platformCredentials.id);

    return result.map((row:any) => ({
      userId: row.userId,
      id: row.id,
      schema: {
        ...row.schema,
        schemaFields: JSON.parse(row.schemaFields).reduce((acc: Array<SchemaField>, field: SchemaField) => {
          acc.push(field)
          return acc;
        }, [])
      },
      isActive: Boolean(row.isActive),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      credentialValues: row.credentialValues
    }));
  }
}
