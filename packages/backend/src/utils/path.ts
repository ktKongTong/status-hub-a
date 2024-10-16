
import path from "node:path";
import {fileURLToPath} from "node:url";

export const getCurrentPath = (url: string)=> {
  return path.dirname(fileURLToPath(url));
}


export const getBasePath = ()=> {
  return path.join(path.dirname(fileURLToPath(import.meta.url)), '../../');
}