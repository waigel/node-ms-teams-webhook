import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts", "src/adaptive-card.d.ts"],
    format: ["esm"],
    dts: !process.env["NO_DTS"],
    external: [],
  },
]);
