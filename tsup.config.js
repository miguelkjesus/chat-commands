import { defineConfig } from "tsup";

export default defineConfig({
  entry: { commands: `src/index.ts` },
  outDir: "dist/bundle",
});
