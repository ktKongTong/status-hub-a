import {migration} from "./migration";

import {initSystemSchemas} from "@/db/initial";

import {getDrizzleDB} from "@/middleware/db";

import ns from '@/route-collector'

import {generateCredentialSchemaAndFieldsFromPlatformCredential, SystemSchemaInsert} from "@/types";
import {main} from "@/index";

async function startup() {
  await migration()

  const  sysCredentialSchemas:SystemSchemaInsert[] =   Object.keys(ns.credentials)
    .map(key => generateCredentialSchemaAndFieldsFromPlatformCredential(ns.credentials[key]))
  await initSystemSchemas(getDrizzleDB(),sysCredentialSchemas)

  await main()
}

await startup()