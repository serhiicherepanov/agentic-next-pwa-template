import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { registry } from "@/lib/openapi/registry";
import { healthResponseSchema } from "@/lib/schemas/health";

extendZodWithOpenApi(z);

registry.registerPath({
  method: "get",
  path: "/api/health",
  tags: ["System"],
  summary: "Health check",
  responses: {
    200: {
      description: "The application is healthy.",
      content: {
        "application/json": {
          schema: healthResponseSchema.openapi("HealthResponse"),
        },
      },
    },
  },
});
