import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    logger: "src/lib/logger/index.ts"
  },
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
  target: "es2020"
});
