import { CequreModule, t } from "cequre-ts";
import type { Collections } from "../_generated/server";

export const routesModule = new CequreModule<Collections>();

// Custom health check endpoint
routesModule.get(
  "/health",
  () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  }),
  {
    detail: {
      summary: "Health check endpoint",
      tags: ["Health"],
    },

    response: t.Object({
      status: t.String(),
      timestamp: t.String(),
    }),
  },
);
