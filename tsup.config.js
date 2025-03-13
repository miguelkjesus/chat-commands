import { defineConfig } from "tsup";

/** @type {import("tsup").Options} */
const shared = {
  outDir: "dist/bundle",
  sourcemap: true,
};

export default defineConfig([
  {
    entry: { "chat-commands": `src/index.ts` },
    dts: true,
    ...shared,
  },
  {
    entry: { "chat-commands.min": `src/index.ts` },
    minify: true,
    ...shared,
  },
]);
