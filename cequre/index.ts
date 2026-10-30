import { createCequre } from "./_generated/server";
import { SQLiteAdapter, defaultSecurity, defaultMonitoring } from "cequre-ts";
import { routesModule } from "./routes";

export const app = createCequre({
  adapter: new SQLiteAdapter(process.env.DATABASE_URL!),
  plugins: [defaultSecurity(), defaultMonitoring()]
})
  .use(routesModule);

if (process.env.CEQURE_CLI_GENERATE) {
  await app.init();
} else if (import.meta.main && process.env.NODE_ENV !== "test") {
  const port = process.env.PORT === "any" ? 0 : (Number(process.env.PORT) || 3000);
  app.start({ port }).catch(console.error);
}
