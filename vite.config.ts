import { defineConfig } from "vite-plus";
import solid from "@solidjs/vite-plugin";
import tailwind from "@tailwindcss/vite";
import { fileRoutes } from "filesystem-routing/vite";
import { nitro } from "nitro/vite";
import unimport from "unimport/unplugin";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwind(),
    fileRoutes({ types: true }),
    solid({
      ssr: true,
      start: true,
      extensions: [".tsx"],
      serverFunctions: true,
      diagnostics: true,
    }),
    nitro({
      preset: "vercel",
      serverEntry: false,
    }),
    unimport.vite({
      dts: true,
      dirs: ["./src/**/*.ts", "./src/components/**/*.tsx"],
      addons: [
        {
          name: "generated-declaration-header",
          declaration: (dts) => `// @ts-nocheck\n/* oxlint-disable */\n${dts}`,
        },
      ],
    }),
  ],
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  server: {
    port: 4090,
  },
  test: {
    environment: "happy-dom",
    exclude: ["**/node_modules/**", "**/dist/**", "**/tests/**", "**/_tests/**"],
  },
});
