import { defineConfig } from "oxlint";
import solidV2 from "eslint-plugin-solid/configs/v2";

export default defineConfig({
  jsPlugins: ["eslint-plugin-solid"],
  ignorePatterns: ["**/*.gen.*", "dist", "**/*.d.ts", "unimport.d"],
  settings: solidV2.settings,
  options: { typeAware: true },
  rules: {
    ...solidV2.rules,
    "typescript/no-floating-promises": "allow",
  },
});
