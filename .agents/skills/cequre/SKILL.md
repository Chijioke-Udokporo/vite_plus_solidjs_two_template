---
name: cequre
description: Build and modify Cequre backend applications using declarative schemas, typed routes and hooks, generated SDKs, and the Cequre testing SDK. Use when working in a scaffolded Cequre project.
---

# Cequre application development

Read the project's agent instructions, package scripts, `.cequre/toolchain.json`, and relevant source before making changes. Use the existing adapter, environment variables, and application structure.

## Source layout

The standard starter contains:

```text
.agents/skills/cequre/SKILL.md
cequre/
├── config.cequre             # System config only: config { ... }
├── collections/
│   └── users.cequre          # One collection per .cequre file
├── routes/
│   └── index.ts              # Exports routesModule
├── index.ts                  # Creates app, applies modules, boots server
└── _generated/               # Compiled server, client, and runtime contracts
```

- Model collections in `cequre/collections/<slug>.cequre`; never append them to `cequre/config.cequre`.
- Model structured data with typed objects and object arrays in the DSL instead of storing JSON strings in text fields.
- Keep access rules in the collection's DSL `access` block when possible. `register` inherits `create` when omitted: `create: false; register: true;` permits signup while closing generic creation. Choose registration permissions deliberately.
- Write custom routes in `cequre/routes/<slug>.ts`, export/register them through `cequre/routes/index.ts`, and apply their module in `cequre/index.ts`.
- Create `hooks/`, `access/`, or `utilities/` only when needed. Hooks belong in TypeScript, never in `.cequre` files. Programmatic access policies are for rules the DSL cannot express.
- Do not edit `cequre/_generated/`, manually duplicate collection types, or invent migration files. Preserve generated runtime aliases in `tsconfig.json`.

## Typed routes and hooks

Import `Collections` from the generated server and use `CequreModule<Collections>` so handler contexts inherit the application's schema. Define TypeBox `body`, `query`, and `params` contracts where relevant, and supply a `response` contract and `detail` metadata for custom JSON endpoints. Response contracts allow SDK generation to preserve return types.

For example, create `cequre/routes/greeting.ts`:

```typescript
import { CequreModule, t } from "cequre-ts";
import type { Collections } from "../_generated/server";

export const greetingModule = new CequreModule<Collections>();
greetingModule.get("/greeting", () => ({ greeting: "Hello from Cequre" }), {
  response: t.Object({ greeting: t.String() }),
  detail: { summary: "Get a greeting", tags: ["Greeting"] },
});
```

Import `greetingModule` in `cequre/routes/index.ts` and register it with `routesModule.use(greetingModule)`. Keep the starter's existing routes. Route paths are relative to the configured API prefix; the default endpoint is `GET /api/greeting`.

When a hook is needed, create `cequre/hooks/index.ts` and let the module infer context types:

```typescript
import { CequreModule } from "cequre-ts";
import type { Collections } from "../_generated/server";

export const hooksModule = new CequreModule<Collections>();
hooksModule.hooks("users", {
  beforeCreate: ({ data }) => {
    data.name = data.name.trim();
  },
});
```

Import `hooksModule` in `cequre/index.ts` and apply `.use(hooksModule)` before starting the app. Do not use untyped casts to register hooks. For larger modules, move collection-specific hooks into `hooks/<slug>.ts` while retaining schema-derived types.

## Generated client

Regenerate after changing schemas or routes. Use `createCequreClient` from `cequre/_generated/client` instead of duplicating fetch wrappers and interfaces. Collection namespaces provide typed `get`, `post`, `patch`, and `delete` methods. Custom routes produce a fluent tree: `/api/greeting` becomes `api.greeting.get()`, and `/api/orders/:id` becomes `api.orders.byId(id).get()`.

After adding the greeting route, create `examples/greeting.ts`:

```typescript
import { createCequreClient } from "../cequre/_generated/client";

const api = createCequreClient({
  baseUrl: process.env.CEQURE_API_URL || "http://localhost:3000",
  credentials: "include",
});
const result = await api.greeting.get();
if (result.error) throw new Error(result.error.message);
if (result.data) console.log(result.data.greeting);
```

Use `credentials: "include"` for cookie authentication and configure the server's allowed origin accordingly. For bearer authentication, use `api.auth.login(...)` and `api.withToken(accessToken)` as shown in the starter's `examples/authenticated-request.ts`. Check the SDK's `data` and `error` result instead of assuming a successful response.

## Development and validation

- Use the generated package scripts for the selected runtime: development, typechecking, testing, and builds.
- Run `cequre generate` after source changes. Commit the project's `.cequre/toolchain.json` with its schema. `cequre generate --preview --json` inspects compatibility/freshness without applying migrations; `cequre generate --check --json` is a CI compatibility gate.
- Use `cequre dev` for watching and regeneration. The standard entry is `cequre/index.ts`; inspect the project scripts before overriding it.
- Inspect database changes before applying `cequre db:sync`. Do not add `--force` casually: it permits destructive schema changes.
- Use a dedicated development/test database. Keep credentials in environment variables and out of source control. Follow the starter's existing environment names rather than inventing alternatives.
- Add tests for changed behavior using `createCequreTest` from `cequre-ts/testing`. Cover routes, hooks, access decisions, and authentication where relevant, and run the project's typecheck and tests.

For the greeting route, create `tests/greeting.test.ts`:

```typescript
import { afterAll, beforeAll, expect, test } from "bun:test";
import { createCequreTest } from "cequre-ts/testing";
import { app } from "../cequre/index";

const cequre = createCequreTest(app);
beforeAll(async () => {
  await app.init();
});
afterAll(async () => {
  app.retire();
  await app.adapter.disconnect();
});

test("greeting route returns its declared response", async () => {
  const response = await cequre.routes.get("/greeting");
  expect(response.status).toBe(200);
  expect(await response.json<{ greeting: string }>()).toEqual({ greeting: "Hello from Cequre" });
});
```

Run `cequre generate`, `bun run typecheck`, and `bun test tests/greeting.test.ts` in a Bun starter. With the development server running, `bun run examples/greeting.ts` prints the greeting.

## Cequre MCP tools

When the Cequre MCP server is connected, inspect its advertised tools and schemas. Use the consolidated tools below; if unavailable, use the project's CLI and source files.

- `cequre_schema`: collections, fields, and globals (`target`, `op`).
- `cequre_code`: TypeScript hooks, utilities, and other runtime modules (`module`, `op`).
- `cequre_routes`: custom endpoints and TypeBox contracts (`action`); `DOCS` supplies route/SDK guidance.
- `cequre_config`: configuration, environment, formatting, and validation (`action`).
- `cequre_security`: DSL access rules and authentication (`action`).
- `cequre_database`: database operations; inspect its action schema before synchronizing.
- `cequre_artifacts`: compiled client/server SDKs, OpenAPI, AST, and error logs (`type`).
- `cequre_test`: test documentation, discovery, scaffolding, and execution (`action`).
- `cequre_cli`: non-interactive CLI operations without a dedicated tool (`args`).

For example, inspect route guidance with `cequre_routes` using `action: "DOCS"` and the current `projectId`, or testing guidance with `cequre_test` using `action: "DOCS"`. Do not assume obsolete individual CRUD tool names exist.
