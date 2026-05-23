import { describe, expect, it } from "vitest";
import { generateOpenApiDocument } from "@/lib/openapi/document";

describe("generateOpenApiDocument", () => {
  it("registers the health endpoint", () => {
    const document = generateOpenApiDocument();

    expect(document.paths["/api/health"]?.get).toBeDefined();
  });
});
