import {Config, defineConfig} from 'drizzle-kit';

const { LOCAL_DB_PATH, DB_ID, D1_TOKEN, CF_ACCOUNT_ID } = process.env;


// export default LOCAL_DB_PATH
//   ? ({
//     schema: './src/db/schema/index.ts',
//     dialect: "sqlite",
//     dbCredentials: {
//       url: LOCAL_DB_PATH,
//     },
//   } satisfies Config)
//   : ({
//     schema: './src/db/schema/index.ts',
//     out: './migrations',
//     dialect: "sqlite",
//     driver: "d1-http",
//     dbCredentials: {
//       databaseId: DB_ID!,
//       token: D1_TOKEN!,
//       accountId: CF_ACCOUNT_ID!,
//     },
//   } satisfies Config);

export default defineConfig({
  schema: './src/db/schema/index.ts',
  dialect: "sqlite",
  dbCredentials: {
    url: './data/sqlite.db',
  },
})