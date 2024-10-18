import 'dotenv/config';

import Database from "better-sqlite3";
import {drizzle} from "drizzle-orm/better-sqlite3";
import {migrate} from "drizzle-orm/better-sqlite3/migrator";
import { mkdir } from 'fs/promises';


export async function migration() {
  await mkdir('./data', {recursive: true});
  const sqlite =new  Database('./data/sqlite.db');
  const db = drizzle(sqlite);
  migrate(db, {migrationsFolder: './drizzle'});
  console.log("migrate finished")
}