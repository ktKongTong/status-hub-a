
import {SchemaField, Credential} from "status-hub-shared/models";

export function buildCredentialValues<T>(schema: SchemaField[], values: Record<string, any>): T {
    // todo Credential['credentialValues']
    const result: any = {};
    schema.forEach(field => {
        const value = values[field.fieldName];
        switch (field.fieldType) {
        case 'string':
            result[field.fieldName] = String(value);
            break;
        case 'number':
            result[field.fieldName] = Number(value);
            break;
        case 'boolean':
            result[field.fieldName] = Boolean(value);
            break;
        default:
            result[field.fieldName] = value;
        }
    });
    return result as T;
}

const schema = {
  platform: 'steam',
  credentialType: 'apikey',
  schemaVersion: 1,
  createdAt: 0,
  updatedAt: 0,
  schemaFields: [
  {
    fieldName: 'apikey',
    fieldType: 'string',
    isRequired: true,
    description: 'steam API Key'
  },
  {
    fieldName: 'steamid',
    fieldType: 'string',
    isRequired: false,
    description: 'steam API Key`s issuer steamid'
  }]
}