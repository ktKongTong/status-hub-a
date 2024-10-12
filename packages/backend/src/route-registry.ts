
import {
  generateCredentialSchemaAndFieldsFromPlatformCredential,
  Namespace,
  RouteItem,
  SystemSchemaInsert
} from "./interface";

import {directoryImport} from "directory-import";
import {getCurrentPath} from "@/utils/path";
import path from "node:path";
import fs from "node:fs";
import {Context, Hono} from "hono";

// see rsshub registry.ts
let modules: Record<string, { namespace: Namespace }> = {};

const __dirname = getCurrentPath(import.meta.url);

let namespaces: Record<string, Namespace & {routes: Record<string, RouteItem & {location: string}>}> = {};
let sysSchemas: Record<string, SystemSchemaInsert> = {};

switch (process.env.NODE_ENV) {
  case 'test':
  case 'production':
      namespaces = JSON.parse(fs.readFileSync(path.join(__dirname, "../assets/build/routes.json")).toString());
    // namespaces = await import('../assets/build/routes.json', { assert: { type: "json" }});
    //@ts-ignore
    // console.log("namespaces", namespaces);
    break;
  default:
    modules = directoryImport({
      targetDirectoryPath: path.join(__dirname, 'router/routes/ns'),
      importPattern: /(\.ns|\.route|\.cr)\.ts$/,
    }) as typeof modules;
}


if (Object.keys(modules).length) {
  for (const module in modules) {
    const content = modules[module] as { namespace: Namespace } | {route: RouteItem};
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
    }else if ('route' in content) {
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
  }
}else {
  Object.keys(namespaces).forEach(ns => {
    const namespace = namespaces[ns];
    const cArr = namespace.supportCredentials.map(it => generateCredentialSchemaAndFieldsFromPlatformCredential(it))
    cArr.forEach(credential => {
      const id = credential.schema.id
      sysSchemas[id] = credential;
    })
  })
}

export {namespaces, sysSchemas}

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