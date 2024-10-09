export * from './logger'
export * from './time'


import path from "node:path";
import {fileURLToPath} from "node:url";

export const getCurrentPath = (url: string)=> {
  return path.dirname(fileURLToPath(url));
}