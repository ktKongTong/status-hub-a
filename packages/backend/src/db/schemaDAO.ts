import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as tables from "./schema";
import { sql, eq, desc, and } from "drizzle-orm";
import {
    CredentialSchemaUpdate,
    CredentialSchemaSelect,
    CredentialSchemaInsert,
} from "status-hub-shared/models";
import {integer, text} from "drizzle-orm/sqlite-core";

export interface ISchemaDAO {
    getCredentialSchemas(): Promise<CredentialSchemaSelect[]>;
    getCredentialSchemaById(schemaId: string): Promise<CredentialSchemaSelect | null>;
    createCredentialSchema(schema: CredentialSchemaInsert): Promise<CredentialSchemaSelect>;
    updateCredentialSchema(schema: CredentialSchemaUpdate): Promise<CredentialSchemaSelect>;
    deleteCredentialSchema(schemaId: string): Promise<boolean>;
}


export class SchemaDAO implements ISchemaDAO {

    constructor(private db: BetterSQLite3Database){}

    async getCredentialSchemas(): Promise<CredentialSchemaSelect[]> {
        const latestVersions = this.db
            .select({
                id: tables.credentialSchema.id,
                maxVersion: sql<number>`MAX(${tables.credentialSchema.schemaVersion})`.as('maxVersion')
            })
            .from(tables.credentialSchema)
            .where(eq(tables.credentialSchema.status, 'ok'))
            .groupBy(tables.credentialSchema.id)
            .as('latestVersions');

        const s = this.db
            .select({
                schema: tables.credentialSchema,
                fields: sql<string>`json_group_array(json_object('fieldName', ${tables.credentialSchemaFields.fieldName}, 'fieldType', ${tables.credentialSchemaFields.fieldType}, 'isRequired', CASE WHEN ${tables.credentialSchemaFields.isRequired} = 1 THEN true ELSE false END, 'description', ${tables.credentialSchemaFields.description}, 'createdAt', ${tables.credentialSchemaFields.createdAt}, 'updatedAt', ${tables.credentialSchemaFields.updatedAt})) FILTER (WHERE ${tables.credentialSchemaFields.fieldName} IS NOT NULL)`
            })
            .from(tables.credentialSchema)
            .innerJoin(latestVersions, and(
                eq(tables.credentialSchema.id, latestVersions.id),
                eq(tables.credentialSchema.schemaVersion, latestVersions.maxVersion)
            ))
            .leftJoin(tables.credentialSchemaFields, and(
                eq(tables.credentialSchema.id, tables.credentialSchemaFields.schemaId),
                eq(tables.credentialSchema.schemaVersion, tables.credentialSchemaFields.schemaVersion)
            ))
            .where(eq(tables.credentialSchema.status, 'ok'))
            .groupBy(tables.credentialSchema.id)
            .orderBy(desc(tables.credentialSchema.schemaVersion));

        const result = await s;
        return result.map(this.mapToCredentialSchema);
    }

    async getCredentialSchemaById(schemaId: string): Promise<CredentialSchemaSelect | null> {
        const result = await this.db
            .select({
                schema: tables.credentialSchema,
                fields: sql<string>`json_group_array(json_object('fieldName', ${tables.credentialSchemaFields.fieldName}, 'fieldType', ${tables.credentialSchemaFields.fieldType}, 'isRequired', ${tables.credentialSchemaFields.isRequired}, 'description', ${tables.credentialSchemaFields.description}, 'createdAt', ${tables.credentialSchemaFields.createdAt}, 'updatedAt', ${tables.credentialSchemaFields.updatedAt})) FILTER (WHERE ${tables.credentialSchemaFields.fieldName} IS NOT NULL)`
            })
            .from(tables.credentialSchema)
            .leftJoin(tables.credentialSchemaFields, and(
                eq(tables.credentialSchema.id, tables.credentialSchemaFields.schemaId),
                eq(tables.credentialSchema.schemaVersion, tables.credentialSchemaFields.schemaVersion),
            ))
            .where(and(
                eq(tables.credentialSchema.status, 'ok'),
                eq(tables.credentialSchema.id, schemaId)
            ))
            .groupBy(tables.credentialSchema.id, tables.credentialSchema.schemaVersion)
            .orderBy(desc(tables.credentialSchema.schemaVersion))
            .having(sql`${tables.credentialSchema.schemaVersion} = MAX(${tables.credentialSchema.schemaVersion})`)
            .limit(1);

        return result.length > 0 ? this.mapToCredentialSchema(result[0]) : null;
    }

    async createCredentialSchema(schema: CredentialSchemaInsert): Promise<CredentialSchemaSelect> {
        const id = crypto.randomUUID()
        //
        const result = await this.db.transaction(async (tx) => {

            const v = {
                id: id,
                platform: schema.platform,
                credentialType: schema.credentialType,
                autoRefreshable: schema.autoRefreshable,
                refreshLogicType: schema.refreshLogicType,
                available: schema.available,
                availablePermissions: schema.availablePermissions,
                permissions: schema.permissions,
                createdBy: 'user' as const
            }
            const newSchema = await tx.insert(tables.credentialSchema).values(v)
              .returning();

            const fields = schema.schemaFields.map(field =>  ({
                ...field,
                schemaId: id,
                schemaVersion: newSchema[0].schemaVersion
            }))
            if(fields.length > 0) {
                const result = await tx.insert(tables.credentialSchemaFields).values(fields).returning()
                return {
                    ...newSchema[0],
                    schemaFields: result
                }
            }
            return {
                ...newSchema[0],
                schemaFields: []
            }
        });
        return result
    }

    async updateCredentialSchema(schema: CredentialSchemaUpdate): Promise<CredentialSchemaSelect> {
        // if adjust schema field name or type, insert new schema, increase schema version, insert new schema fields
        // if not, update fields like available, permissions, permissions

        const result = await this.db.transaction(async (tx) => {
            const schemaId = schema.id
            const currentSchema = await tx.select().from(tables.credentialSchema).where(eq(tables.credentialSchema.id, schemaId)).orderBy(desc(tables.credentialSchema.schemaVersion)).limit(1);
            if (currentSchema.length === 0) return null;
            const currentSchemaVersion = currentSchema[0].schemaVersion;
            const currentSchemaFields = await tx.select().from(tables.credentialSchemaFields).where(eq(tables.credentialSchemaFields.schemaId, schemaId)).orderBy(desc(tables.credentialSchemaFields.schemaVersion));
            // compare schema fields, if field name or type changed, insert new schema, increase schema version, insert new schema fields
            // if not, update fields like available, permissions, permissions
            const fieldsChanged = schema.schemaFields.some(newField => {
                const currentField = currentSchemaFields.find(f => f.fieldName === newField.fieldName);
                return !currentField || 
                       currentField.fieldType !== newField.fieldType ||
                       currentField.isRequired !== newField.isRequired;
            }) || currentSchemaFields.some(currentField => 
                !schema.schemaFields.find(newField => newField.fieldName === currentField.fieldName)
            );


            if (fieldsChanged) {
                // 插入新版本的模式
                const newSchema = await tx.insert(tables.credentialSchema).values({
                    id: schemaId,
                    platform: schema.platform || currentSchema[0].platform,
                    credentialType: schema.credentialType || currentSchema[0].credentialType,
                    schemaVersion: currentSchemaVersion + 1,
                    available: schema.available ?? currentSchema[0].available,
                    availablePermissions: schema.availablePermissions || currentSchema[0].availablePermissions,
                    permissions: schema.permissions || currentSchema[0].permissions,
                    autoRefreshable: schema.autoRefreshable,
                    refreshLogicType: schema.refreshLogicType,
                }).returning();

                const newSchemaFields = schema.schemaFields.map(field => ({
                    ...field,
                    fieldType: field.fieldType as any,
                    schemaId: schemaId,
                    schemaVersion: newSchema[0].schemaVersion
                }));
                // new schema fields                
                const newest = await tx.insert(tables.credentialSchemaFields).values(newSchemaFields).returning();
                return {
                    ...newSchema[0],
                    schemaFields: newest
                };
            }
            // 如果字段没有变化，只更新其他属性
            const updatedSchema = await tx.update(tables.credentialSchema)
                .set({
                    platform: schema.platform,
                    credentialType: schema.credentialType,
                    available: schema.available,
                    availablePermissions: schema.availablePermissions,
                    permissions: schema.permissions,
                    autoRefreshable: schema.autoRefreshable,
                    refreshLogicType: schema.refreshLogicType,
                })
                .where(eq(tables.credentialSchema.id, schemaId))
                .returning();
            const changedDescriptionFields = !fieldsChanged ? schema.schemaFields.filter(newField => {
                const currentField = currentSchemaFields.find(f => f.fieldName === newField.fieldName);
                return currentField && currentField.description !== newField.description;
            }).map(field => ({
                description: field.description,
                fieldName: field.fieldName,
                fieldType: field.fieldType as any,
                isRequired: field.isRequired
            })) : [];

            const res = changedDescriptionFields.map(async field => {
                const currentField = await tx.update(tables.credentialSchemaFields)
                .set(field)
                .where(and(
                    eq(tables.credentialSchemaFields.schemaId, schemaId),
                    eq(tables.credentialSchemaFields.fieldName, field.fieldName),
                    eq(tables.credentialSchemaFields.schemaVersion, currentSchemaVersion)
                )).returning()
                return currentField[0]
            })
            const fields = await Promise.all(res)
            const notChangedFields = currentSchemaFields.filter(field => !fields.find(f => f.fieldName === field.fieldName))

            const updatedFields = [...fields, ...notChangedFields]
            return {
                ...updatedSchema[0],
                schemaFields: updatedFields
            };
        });
        return result!
    }

    // version ?
    async deleteCredentialSchema(schemaId: string): Promise<boolean> {

        const result = await this.db.update(tables.credentialSchema).set({status: 'deleted'}).where(eq(tables.credentialSchema.id, schemaId))
        .returning({
            id: tables.credentialSchema.id,
        })
        return result.length > 0
    }

    private mapToCredentialSchema(row: any): CredentialSchemaSelect {
        return {
            id: row.schema.id,
            platform: row.schema.platform,
            credentialType: row.schema.credentialType,
            schemaVersion: row.schema.schemaVersion,
            available: row.schema.available,
            permissions: row.schema.permissions,
            availablePermissions: row.schema.availablePermissions,
            createdAt: row.schema.createdAt,
            updatedAt: row.schema.updatedAt,
            autoRefreshable: row.schema.autoRefreshable,
            refreshLogicType: row.schema.refreshLogicType,
            refreshLogic: row.schema.refreshLogic,
            createdBy: row.schema.createdBy,
            maximumRefreshIntervalInSec: row.schema.maximumRefreshIntervalInSec,
            schemaFields: JSON.parse(row.fields).map((field: any) => ({
                ...field,
                isRequired: Boolean(field.isRequired)
            }))
        };
    }
}
