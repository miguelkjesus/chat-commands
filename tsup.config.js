import { defineConfig } from "tsup";

export default defineConfig({
  entry: { "chat-commands": `src/index.ts` },
  outDir: "dist/bundle",
});
