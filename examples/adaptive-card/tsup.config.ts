import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["index.ts"],
    format: ["esm"],
    dts: !process.env["NO_DTS"],
    external: [],
  },
]);
