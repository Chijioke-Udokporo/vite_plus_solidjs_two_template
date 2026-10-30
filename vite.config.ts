import { defineConfig } from "vite-plus";
import solid from "@solidjs/vite-plugin";
import tailwind from "@tailwindcss/vite";
import { fileRoutes } from "filesystem-routing/vite";

export default defineConfig({
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
  ],
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
});
