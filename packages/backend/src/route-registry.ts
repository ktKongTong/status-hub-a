
import {
  generateCredentialSchemaAndFieldsFromPlatformCredential,
  Namespace, PlatformCredential,
  RouteItem,
  SystemSchemaInsert
} from "@/types";

import {directoryImport} from "directory-import";
import {getCurrentPath} from "@/utils/path";
import path from "node:path";
import fs from "node:fs";
import {Context, Hono} from "hono";
import {RefreshFunction} from "@/types";

// see rsshub registry.ts
let modules: Record<string, { namespace: Namespace }> = {};

const __dirname = getCurrentPath(import.meta.url);

let namespaces: Record<string, Namespace & {routes: Record<string, RouteItem & {location: string}>}> = {};

let sysSchemas: Record<string, SystemSchemaInsert> = {};

let credentialSchemas: Record<string, SystemSchemaInsert & {location: string,namespace:string, refreshFunc?: RefreshFunction}> = {}
let credentialRefreshFuncs: Record<string, RefreshFunction> = {}

type RouteModuleContent = { namespace: Namespace }
  | {route: RouteItem}
  | {credential: PlatformCredential, refreshFunc?: RefreshFunction}

switch (process.env.NODE_ENV) {
  case 'test':
  case 'production':
      namespaces = JSON.parse(fs.readFileSync(path.join(__dirname, "../assets/build/routes.json")).toString());
      credentialSchemas = JSON.parse(fs.readFileSync(path.join(__dirname, "../assets/build/credential-schemas.json")).toString());
    break;
  default:
    modules = directoryImport({
      targetDirectoryPath: path.join(__dirname, 'router/routes/ns'),
      importPattern: /(\.ns|\.route|\.cr)\.ts$/,
    }) as typeof modules;
}


if (Object.keys(modules).length) {
  for (const module in modules) {
    const content = modules[module] as RouteModuleContent
    const namespace = module.split(/[/\\]/)[1];
    if ('namespace' in content) {
      namespaces[namespace] = Object.assign({ routes: {}, supportCredentials: [] }, namespaces[namespace], content.namespace);
      namespaces[namespace]
        .supportCredentials
        .map(it => generateCredentialSchemaAndFieldsFromPlatformCredential(it))
        .forEach((cur)=> sysSchemas[cur.schema.id] = cur)
    }
    else if ('route' in content) {
      if (!namespaces[namespace]) {
        namespaces[namespace] = {
          platform: namespace,
          routes: {},
          category: [],
          supportCredentials: []
        };
      }
      if (Array.isArray(content.route.path)) {
        for (const path of content.route.path) {
          namespaces[namespace].routes[path] = {
            ...content.route,
            location: module.split(/[/\\]/).slice(2).join('/'),
          };
        }
      } else {
        namespaces[namespace].routes[content.route.path] = {
          ...content.route,
          location: module.split(/[/\\]/).slice(2).join('/'),
        };
      }
    }
    else if('credential' in content) {
      const cr = content.credential
      const schema = generateCredentialSchemaAndFieldsFromPlatformCredential(cr)
      credentialSchemas[`system-${cr.platform}-${cr.credentialType}`] = {
        ...schema,
        namespace: cr.platform,
        location: module.split(/[/\\]/).slice(2).join('/'),
      }
      const credentialID = `system-${cr.platform}-${cr.credentialType}`
      if(content.refreshFunc) {
        credentialRefreshFuncs[credentialID] = content.refreshFunc
      }
    }
  }
}else {
  Object.keys(namespaces).forEach(ns => {
    const namespace = namespaces[ns];
    namespace.supportCredentials
      .map(it => generateCredentialSchemaAndFieldsFromPlatformCredential(it))
      .forEach((cur)=> sysSchemas[cur.schema.id] = cur)
  })
  for(const cr of Object.keys(credentialSchemas)) {
    let credential = credentialSchemas[cr];
    if (typeof credential.refreshFunc !== 'function') {
      const location = credential.location.replace(/\.ts$/,'.js')
      const { refreshFunc } = await import(`./router/routes/ns/${credential.namespace}/${location}`);
      credential.refreshFunc = refreshFunc;
      credentialRefreshFuncs[cr] = refreshFunc;
    }
    credentialSchemas[cr] = credential;
  }
}

export { namespaces, sysSchemas, credentialRefreshFuncs, credentialSchemas }

const app = new Hono().basePath(`/api/route`);

Object.keys(namespaces)
  .forEach(namespace => {
    const ns = namespaces[namespace]
    let h = new Hono().basePath(`/${ns.platform}`)
    Object.keys(ns.routes).map(p => {
      const r = ns.routes[p]
      const wrappedHandler = async (ctx:Context) => {
          if (typeof r.handler !== 'function') {
            const location = r.location.replace(/\.ts$/,'.js')
            const { route } = await import(`./router/routes/ns/${namespace}/${location}`);
            r.handler = route.handler;
          }
        return r.handler(ctx)
      };
      h.get(r.path, wrappedHandler)
    })
    app.route(`/`, h)
  })

export { app as nsRouter }