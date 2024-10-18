
import {
  Namespace,
  PlatformCredential,
  RefreshFunction,
  RouteItem,
} from "@/types";
import {getCurrentPath} from "@/utils/path";
import fs from "node:fs";
import path from "node:path";
import {directoryImport} from "directory-import";

// inspired by rsshub registry.ts

type NamespaceModule = { namespace: Namespace }

type RouterModule = {route: RouteItem}

type CredentialModule = {credential: PlatformCredential, refreshFunc?: RefreshFunction}


type Module = NamespaceModule | RouterModule | CredentialModule

type SerializedRoute = RouteItem & { location: string }
type SerializedCredential = PlatformCredential & { location: string }

type SerializedNamespace = Namespace & { routes: Record<string, SerializedRoute> }


const __dirname = getCurrentPath(import.meta.url);


const loadModuleByNSAndLocation = async (ns: string, location: string) => {
  return await import(`./router/routes/ns/${ns}/${location}`)
}

function moduleLoadByScan() {
  let modules: Record<string, Module> = {};
  modules = directoryImport({
    targetDirectoryPath: path.join(__dirname, 'router/routes/ns'),
    importPattern: /(\.ns|\.route|\.cr)\.ts$/
  }) as typeof modules
  let ns:Record<string, Namespace & {routes: Record<string, SerializedRoute>}> = {}
  let credentials: Record<string, SerializedCredential> = {}
  let credentialRefreshFuncs: Record<string, RefreshFunction> = {}
  for (const module in modules) {
    const content = modules[module]
    const namespace = module.split(/[/\\]/)[1];
    if ('namespace' in content) {
      ns[namespace] = Object.assign({ routes: {}, supportCredentials: [] }, ns[namespace], content.namespace);
    }
    else if ('route' in content) {
      if (!ns[namespace]) {
        ns[namespace] = {
          platform: namespace,
          routes: {},
          category: [],
          supportCredentials: []
        };
      }
      let paths:string[] = [];
      if(Array.isArray(content.route.path)) {
        paths = content.route.path
      }else if(typeof content.route.path === 'string') {
        paths.push(content.route.path);
      }
      for (const path of paths) {
        ns[namespace].routes[path] = {
          ...content.route,
          location: module.split(/[/\\]/).slice(2).join('/'),
        }
      }
    }
    else if ('credential' in content) {
      const cr = content.credential
      const credentialID = `system-${cr.platform}-${cr.credentialType}-${cr.version}`
      credentials[credentialID] = {
        ...content.credential,
        location: module.split(/[/\\]/).slice(2).join('/'),
      }
      if(content.refreshFunc) {
        credentialRefreshFuncs[credentialID] = content.refreshFunc
      }
    }
  }
  return {
    credentials: credentials,
    namespaces: ns,
    // for runtime usage
    credentialRefreshFuncs: credentialRefreshFuncs
  }
}


async function moduleLoadFromJSON() {
  const __dirname = getCurrentPath(import.meta.url)
  const namespaces:Record<string, SerializedNamespace> = JSON.parse(fs.readFileSync(path.join(__dirname, "../assets/build/routes.json")).toString());
  const credentialSchemas:Record<string, SerializedCredential> = JSON.parse(fs.readFileSync(path.join(__dirname, "../assets/build/credential-schemas.json")).toString());
  let credentialRefreshFuncs: Record<string, RefreshFunction> = {}
    for(const cr of Object.keys(credentialSchemas)) {
      let credential = credentialSchemas[cr];
      const location = credential.location.replace(/\.ts$/,'.js')
      const { refreshFunc } = await loadModuleByNSAndLocation(credential.platform, location);
      credentialRefreshFuncs[cr] = refreshFunc;
      credentialSchemas[cr] = credential;
    }
  return {
    credentials: credentialSchemas,
    namespaces: namespaces,
    // for runtime usage
    credentialRefreshFuncs: credentialRefreshFuncs,
  }
}

const env = process.env.NODE_ENV


const res = (env != 'production' && env != 'test') ? moduleLoadByScan() : await moduleLoadFromJSON()





export default {
  credentials: res.credentials,
  namespaces: res.namespaces,
  credentialRefreshFuncs: res.credentialRefreshFuncs
}