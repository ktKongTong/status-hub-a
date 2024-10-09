import { namespaces } from '@/route-registry';
import fs from 'node:fs';
import path from 'node:path';
import {getCurrentPath} from "status-hub-shared/utils";
import {execSync} from "node:child_process";

const __dirname = getCurrentPath(import.meta.url);

fs.mkdirSync(path.join(__dirname, '../assets/build'))
fs.writeFileSync(path.join(__dirname, '../assets/build/routes.json'), JSON.stringify(namespaces, null, 2));

execSync('tsc -p tsconfig.json && tsc-alias')