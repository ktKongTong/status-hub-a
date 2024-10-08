
// rewrite only support at build phase
// see: https://github.com/vercel/next.js/discussions/33932
import path from "node:path";
import {fileURLToPath, } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default (phase, { defaultConfig }) => {
    return {
        ...defaultConfig,
        reactStrictMode: true,
        swcMinify: true,
        // output: "standalone",
        // still can not work with docker + pnpm workspace properly
        // https://github.com/vercel/next.js/discussions/38435
        // experimental: { outputFileTracingRoot: path.join(__dirname, "../../") },
    };
}
