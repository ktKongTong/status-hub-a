import namespace from '@/route-collector';
import fs from 'node:fs';
import path from 'node:path';
import {getCurrentPath} from "@/utils/path";
import {execSync} from "node:child_process";

const __dirname = getCurrentPath(import.meta.url);

execSync('tsc -p tsconfig.build.json && tsc-alias')
fs.mkdirSync(path.join(__dirname, '../dist/assets/build'), { recursive: true });
fs.mkdirSync(path.join(__dirname, '../assets/build'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '../dist/assets/build/routes.json'), JSON.stringify(namespace.namespaces, null, 2));
fs.writeFileSync(path.join(__dirname, '../assets/build/routes.json'), JSON.stringify(namespace.namespaces, null, 2));
fs.writeFileSync(path.join(__dirname, '../dist/assets/build/credential-schemas.json'), JSON.stringify(namespace.credentials, null, 2));
fs.writeFileSync(path.join(__dirname, '../assets/build/credential-schemas.json'), JSON.stringify(namespace.credentials, null, 2));
