
// rewrite only support at build phase
// see: https://github.com/vercel/next.js/discussions/33932
// eslint-disable-next-line import/no-anonymous-default-export
import path from "path";
import {fileURLToPath} from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// eslint-disable-next-line import/no-anonymous-default-export
export default (phase, { defaultConfig }) => {
    return {
        ...defaultConfig,
        transpilePackages: ['status-hub-shared'],
        reactStrictMode: true,
        swcMinify: true,
        output: "standalone",
        experimental: {
            outputFileTracingRoot: path.join(__dirname, "../../"),
        },
        // still can not work with docker + pnpm workspace properly
        // https://github.com/vercel/next.js/discussions/38435
        // experimental: { outputFileTracingRoot: path.join(__dirname, "../../") },
    };
}
