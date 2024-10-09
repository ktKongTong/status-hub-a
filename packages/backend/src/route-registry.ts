
import {
  generateCredentialSchemaAndFieldsFromPlatformCredential,
  Namespace,
  PlatformCredential,
  SystemSchemaInsert
} from "./interface";

import {directoryImport} from "directory-import";
import {getCurrentPath} from "status-hub-shared/utils";
import path from "node:path";

let modules: Record<string, { namespace: Namespace }> = {};

const __dirname = getCurrentPath(import.meta.url);

switch (process.env.NODE_ENV) {
  case 'test':
  case 'production':
    // @ts-expect-error
    namespaces = await import('../assets/build/routes.json');
    break;
  default:
    modules = directoryImport({
      targetDirectoryPath: path.join(__dirname, 'router/routes/ns'),
      importPattern: /\.ts$/,
    }) as typeof modules;
}


let namespaces: Record<string, Namespace> = {};
let sysSchemas: Record<string, SystemSchemaInsert> = {}


if (Object.keys(modules).length) {
  for (const module in modules) {
    const content = modules[module] as { namespace: Namespace };
    const namespace = module.split(/[/\\]/)[1];
    if ('namespace' in content) {
      namespaces[namespace] = Object.assign({ routes: {}, supportCredentials: [] }, namespaces[namespace], content.namespace);
      const res = namespaces[namespace]
      // generateCredentialSchemaAndFieldsFromPlatformCredential
      const cArr = res.supportCredentials.map(it => generateCredentialSchemaAndFieldsFromPlatformCredential(it))
      cArr.forEach(credential => {
        const id = credential.schema.id
        sysSchemas[id] = credential;
      })
    }
  }
}


export {namespaces, sysSchemas}