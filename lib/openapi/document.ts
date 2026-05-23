import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import "@/lib/openapi/paths/health";
import { registry } from "@/lib/openapi/registry";

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Agentic Next PWA Template API",
      version: "0.1.0",
    },
    servers: [{ url: "/" }],
  });
}
