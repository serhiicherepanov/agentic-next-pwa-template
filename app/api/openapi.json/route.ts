import { NextResponse } from "next/server";
import { generateOpenApiDocument } from "@/lib/openapi/document";

export function GET() {
  return NextResponse.json(generateOpenApiDocument());
}
