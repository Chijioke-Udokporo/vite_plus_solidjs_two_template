<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

## Solid 2 RC + Nitro: confirmed project lesson

- This frontend uses Solid **2 RC** with `@solidjs/vite-plugin`, not the older Vinxi-based SolidStart setup. Do not conflate Solid 2 with SolidStart v2 when choosing documentation.
- With `solid({ ssr: true, start: true })`, the plugin generates server and client entries from [src/App.tsx](./src/App.tsx) and uses [src/Document.tsx](./src/Document.tsx) as the document shell. Nitro can adopt the generated SSR handler; a handwritten server entry is not required for this setup.
- Nitro is included for Vercel deployment. The working [Vite configuration](./vite.config.ts) uses `nitro({ preset: "vercel", serverEntry: false })`. That `serverEntry` setting does not disable Solid's generated SSR handler.
- **Confirmed failure:** a leftover root `index.html` referenced the nonexistent `/src/main.ts`. Nitro auto-detected the HTML as its renderer, taking precedence over its automatic Solid SSR renderer wiring. Adding Nitro therefore produced a missing-entry error/404.
- **Confirmed resolution:** the user removed the obsolete HTML entry and reported that the app worked. Do not reintroduce a starter HTML entry pointing at `/src/main.ts`, or create a custom server merely to work around this symptom. Inspect renderer selection and stale HTML entries first.
- This lesson reflects the installed prerelease integration verified on 2026-10-31. Re-check plugin behavior if versions or the entry architecture change.
