import {assert, beforeAll, describe, expect, expectTypeOf, it} from "vitest";
import * as fs from "node:fs";
import Database from "better-sqlite3";
import {migrate} from "drizzle-orm/better-sqlite3/migrator";
import {existsSync, mkdirSync} from "fs";
import {drizzle} from "drizzle-orm/better-sqlite3";
import {getDrizzleDB} from "@/middleware/db";
import {initSystemSchemas} from "@/db/initial";
import {DBInstance} from "@/db/index";
import {CredentialType} from "status-hub-shared/models";
import {credentialOpenAPISchema} from "status-hub-shared/models/vo";
import {Credential} from "status-hub-shared/models/dbo";
import {getCurrentPath} from "@/utils/path";
import path from "node:path";

const sysSchemas = {
  "system-bilibili-cookie": {
    "schema": {
      refreshLogic: 'system',
      "id": "system-bilibili-cookie",
      "platform": "bilibili",
      "schemaVersion": 1,
      "credentialType": "cookie" as CredentialType,
      "autoRefreshable": true,
      "description": "Bilibili 的网页cookie，只需要填写 SESSDATA 字段即可",
      "maximumRefreshIntervalInSec": 2592000,
      "available": true,
      "availablePermissions": "",
      "permissions": "",
      "refreshLogicType": "system" as const,
      "schemaFields": [
        {
          "schemaId": "system-bilibili-cookie",
          "schemaVersion": 1,
          "fieldName": "SESSDATA",
          "fieldType": "string" as "string" | "number" | "boolean",
          "isRequired": true,
          "description": "SESSDATA"
        }
      ],
      "status": "ok",
      "createdBy": "system" as const
    },
    "fields": [
      {
        "schemaId": "system-bilibili-cookie",
        "schemaVersion": 1,
        "fieldName": "SESSDATA",
        "fieldType": "string" as "string" | "number" | "boolean",
        "isRequired": true,
        "description": "SESSDATA"
      }
    ],
    "namespace": "bilibili",
    "location": "credentials/cookie.cr.ts"
  }
}
const currentPath = getCurrentPath(import.meta.url);
const getP = (p: string) => path.join(currentPath, "../../", p)

const initDB = async ()=> {
  const sysCredentialSchemas =
    Object.keys(sysSchemas).map(sysSchemaKey => sysSchemas[sysSchemaKey as keyof typeof sysSchemas]);

  await initSystemSchemas(getDrizzleDB(),sysCredentialSchemas).then(() => {console.info("sys schema init success")})
}

describe("db", () => {
  beforeAll(async () => {
    console.log('migrate')
    const p = getP("data")
    console.log('p',p)
    if(!existsSync(getP('data/sqlite.test.db')) && !existsSync(getP('data')) ){
      mkdirSync(getP('data'), {recursive: true});
    } else {
      fs.rmSync(getP('data/sqlite.test.db'))
    }
    const sqlite =new Database(getP('./data/sqlite.test.db'));
    const db = drizzle(sqlite);
    migrate(db, {migrationsFolder: getP('./drizzle')});
  })
  it('init-db',async () => {
  await initDB()
  const dao = DBInstance.dao
  const res = await dao.schemaDAO.getCredentialSchemas()
  expect(res.length > 0)
})
  it('credential-schema-create-user',async () => {
  const dao = DBInstance.dao
  const v = {
    user: {
      id: "test",
      name: "admin",
      email:"admin@example.com",
      emailVerified: new Date(),
      avatar: `https://avatar.iran.liara.run/username?username=admin`,
    },
    account: {
      userId: "test",
      type: 'email' as const,
      provider: 'self',
      tokenType: 'password',
      accessToken: "hashedPasswd",
      providerAccountId: "uid",
    }
  }
  const res = await dao.userDAO.createNewUser(v)
  const user = await dao.userDAO.getUserByUserId("test")
  assert.deepEqual(res.user,user)
})
  it('credential-schema-create-credential.success', async ()=> {
  const dao = DBInstance.dao
  const credentialType = 'cookie'
  const platform = `bilibili`
  const schemaId = `system-${platform}-${credentialType}`
  const schemaVersion = 1
  const userid = 'test'
  const cr = { SESSDATA: 'test'}
  await dao.credentialDAO.addCredential(userid, schemaId, schemaVersion, cr)
  const credentials = await dao.credentialDAO.getCredentialByPlatformAndType(userid, platform, [credentialType])
  assert.deepEqual(cr, credentials[0].credentialValues)
  assert.equal(schemaVersion, credentials[0].schema.schemaVersion)
  assert.equal(schemaId, credentials[0].schema.id)
  assert.equal(userid, credentials[0].userId)
  expect(credentialOpenAPISchema.safeParse(credentials[0]).success)
  expectTypeOf(credentials[0]).toMatchTypeOf<Credential>()
})
  it('credential-schema-create-credential.schema-not-exist', async ()=> {
  const dao = DBInstance.dao
  const credentialType = 'apiToken'
  const platform = `steam`
  const schemaId = `system-${platform}-${credentialType}`
  const schemaVersion = 1
  const userid = 'test'
  const cr = { apiKey: 'test', steamid: 'test'}
  await expect(() => dao.credentialDAO.addCredential(userid, schemaId, schemaVersion, cr))
    .rejects.toThrowError(/Credential schema not found/)
})

})
