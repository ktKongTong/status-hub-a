
import {defineConfig} from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import * as path from "node:path";
const config =  defineConfig({
  resolve: {
    alias: {
      'status-hub-shared': path.resolve(__dirname, '../shared/src')
    }
  },
  plugins: [tsconfigPaths(),],
})


export default config;