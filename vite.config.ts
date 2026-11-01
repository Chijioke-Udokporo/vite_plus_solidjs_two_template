import { defineConfig } from "vite-plus";
import solid from "@solidjs/vite-plugin";
import tailwind from "@tailwindcss/vite";
import { fileRoutes } from "filesystem-routing/vite";
import { nitro } from "nitro/vite";

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
